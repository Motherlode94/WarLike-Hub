// Public read-only GitHub quality dashboard; never request credentials or invent statuses.
export const OWNER='Motherlode94';
export const PROJECTS=['WarLike-Engine','WarLike-Studio','WarLike-Server','WarLike-Hub','WarLike-Ebook','WarLike-Monteur','WarLike-Rig-Studio','WarLike-Library','WarLike-Tower','WarLike-Heart','WarLike-Asset-Stores','WarLike-Virtual-Idols'];
export function projectEndpoint(repo) {
 if(!PROJECTS.includes(repo))throw new TypeError('Dépôt non autorisé');
 return 'https://api.github.com/repos/'+OWNER+'/'+repo+'/actions/runs?branch=main&per_page=15';
}
export function summarizeRuns(payload) {
 if(!payload||!Array.isArray(payload.workflow_runs))throw new TypeError('Réponse GitHub invalide');
 const byWorkflow=new Map();
 for(const run of payload.workflow_runs){
  if(run?.event!=='push' && run?.event!=='workflow_dispatch' && run?.event!=='schedule')continue;
  if(typeof run.name!=='string'||!run.name.trim())continue;
  if(!byWorkflow.has(run.name))byWorkflow.set(run.name,run);
 }
 const workflows=[...byWorkflow.values()].map(run=>({
  name:run.name,
  state:run.status==='completed'?(run.conclusion==='success'?'success':run.conclusion==='failure'?'failure':'other'):'running',
  url:typeof run.html_url==='string'&&/^https:\/\/github\.com\/Motherlode94\/WarLike-[\w-]+\/actions\/runs\/\d+$/.test(run.html_url)?run.html_url:null,
  commit:typeof run.head_sha==='string'?run.head_sha.slice(0,7):'—',
  created:typeof run.created_at==='string'?run.created_at:null
 }));
 const state=!workflows.length?'unknown':workflows.some(x=>x.state==='failure')?'failure':workflows.some(x=>x.state==='running')?'running':workflows.every(x=>x.state==='success')?'success':'unknown';
 return {state,workflows};
}
