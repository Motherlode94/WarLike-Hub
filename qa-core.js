// Public GitHub Actions status model. An absent, stale or non-successful run never means passing.
export const OWNER='Motherlode94';
export const PROJECTS=['WarLike-Engine','WarLike-Studio','WarLike-Server','WarLike-Hub','WarLike-Ebook','WarLike-Monteur','WarLike-Rig-Studio','WarLike-Library','WarLike-Tower','WarLike-Heart','WarLike-Asset-Stores','WarLike-Virtual-Idols'];
export const MAX_AGE_MS=7*24*60*60*1000;
export const CACHE_MS=10*60*1000;
export const MAX_OPEN_PRS=15;
export function projectEndpoint(repo,kind='main'){
 if(!PROJECTS.includes(repo))throw new TypeError('Dépôt non autorisé');
 const base='https://api.github.com/repos/'+OWNER+'/'+repo+'/';
 if(kind==='main')return base+'actions/runs?branch=main&per_page=100';
 if(kind==='pulls')return base+'pulls?state=open&sort=updated&direction=desc&per_page='+MAX_OPEN_PRS;
 if(kind==='pr-runs')return base+'actions/runs?event=pull_request&per_page=100';
 throw new TypeError('Endpoint GitHub non autorisé');
}
function dateMillis(run){const date=Date.parse(run?.updated_at||run?.created_at||'');return Number.isFinite(date)?date:NaN;}
function statusOf(run,now){
 const t=dateMillis(run);
 if(!Number.isFinite(t)||t>now+60000||now-t>MAX_AGE_MS)return 'stale';
 if(run.status!=='completed')return ['queued','waiting','requested','pending','in_progress'].includes(run.status)?'running':'unknown';
 if(run.conclusion==='success')return 'success';
 if(['failure','timed_out','action_required','startup_failure'].includes(run.conclusion))return 'failure';
 return 'unknown';
}
function safeRunUrl(repo,url){
 const prefix='https://github.com/'+OWNER+'/'+repo+'/actions/runs/';
 return typeof url==='string'&&url.startsWith(prefix)&&/^\d+$/.test(url.slice(prefix.length))?url:null;
}
function toWorkflow(run,repo,now){
 return {name:run.name,state:statusOf(run,now),url:safeRunUrl(repo,run.html_url),commit:typeof run.head_sha==='string'?run.head_sha.slice(0,7):'—',created:run.created_at||null};
}
function aggregate(workflows){
 if(!workflows.length)return 'unknown';
 if(workflows.some(w=>w.state==='failure'))return 'failure';
 if(workflows.some(w=>w.state==='running'))return 'running';
 if(workflows.some(w=>w.state==='stale'))return 'stale';
 return workflows.every(w=>w.state==='success')?'success':'unknown';
}
export function summarizeRuns(payload,{repo='WarLike-Engine',now=Date.now()}={}){
 if(!payload||!Array.isArray(payload.workflow_runs))throw new TypeError('Réponse GitHub invalide');
 const byWorkflow=new Map();
 for(const run of payload.workflow_runs){
  if(!['push','workflow_dispatch','schedule'].includes(run?.event))continue;
  if(typeof run.name!=='string'||!run.name.trim())continue;
  // GitHub returns runs by newest first; sort explicitly to protect against reordering.
  const existing=byWorkflow.get(run.name);
  if(!existing||dateMillis(run)>dateMillis(existing))byWorkflow.set(run.name,run);
 }
 const workflows=[...byWorkflow.values()].map(run=>toWorkflow(run,repo,now));
 return {state:aggregate(workflows),workflows};
}
export function summarizePullRequests(pullsPayload,runsPayload,{repo='WarLike-Engine',now=Date.now()}={}){
 if(!Array.isArray(pullsPayload)||!runsPayload||!Array.isArray(runsPayload.workflow_runs))throw new TypeError('Réponse PR GitHub invalide');
 const prs=pullsPayload.slice(0,MAX_OPEN_PRS).filter(p=>Number.isInteger(p.number)&&p.number>0);
 const result=prs.map(pr=>{
  const sha=pr.head?.sha;
  const matching=runsPayload.workflow_runs.filter(run=>run.event==='pull_request'&&run.head_sha===sha&&run.name&&run.status);
  // Preserve the newest run for each workflow, never the oldest run returned.
  const byName=new Map();
  for(const run of matching){
   const prior=byName.get(run.name);
   if(!prior||dateMillis(run)>dateMillis(prior))byName.set(run.name,run);
  }
  const workflows=[...byName.values()].map(run=>toWorkflow(run,repo,now));
  const latest=Date.parse(pr.updated_at||'');
  const stale=!Number.isFinite(latest)||now-latest>MAX_AGE_MS;
  return {number:pr.number,title:String(pr.title||'PR #'+pr.number).slice(0,120),draft:pr.draft===true,url:pr.html_url===`https://github.com/${OWNER}/${repo}/pull/${pr.number}`?pr.html_url:null,head:typeof sha==='string'?sha.slice(0,7):'—',state:stale?'stale':aggregate(workflows),workflows};
 });
 return {state:aggregate(result.map(p=>({state:p.state}))),prs:result,truncated:pullsPayload.length>=MAX_OPEN_PRS||runsPayload.workflow_runs.length>=100};
}
export function summarizeProject(mainPayload,pullsPayload,prPayload,options={}){
 const main=summarizeRuns(mainPayload,options),pullRequests=summarizePullRequests(pullsPayload,prPayload,options);
 return {main,pullRequests,state:aggregate([{state:main.state},{state:pullRequests.prs.length?pullRequests.state:'success'}])};
}
