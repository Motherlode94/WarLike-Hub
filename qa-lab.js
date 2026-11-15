import {PROJECTS,OWNER,CACHE_MS,projectEndpoint,summarizeProject} from './qa-core.js';
const $=id=>document.getElementById(id);
const label={success:'Réussi',failure:'Échec',running:'En cours',unknown:'Inconnu',stale:'Périmé'};
const nodes=new Map();
const cache=new Map();
const MAX_CONCURRENT=3;
let lastRefresh=0,active=false;
for(const repo of PROJECTS){
 const card=document.createElement('article');card.className='project';
 const heading=document.createElement('h3');heading.textContent=repo;
 const badge=document.createElement('span');badge.className='status unknown';badge.textContent='Non vérifié';
 const title=document.createElement('div');title.className='projectHead';title.append(heading,badge);
 const details=document.createElement('div');details.className='details';details.textContent='Aucune vérification effectuée';
 const link=document.createElement('a');link.href='https://github.com/'+OWNER+'/'+repo+'/actions';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Ouvrir GitHub Actions ↗';
 card.append(title,details,link);$('projects').append(card);nodes.set(repo,{badge,details});
}
function present(repo,report){
 const {badge,details}=nodes.get(repo);
 badge.className='status '+report.state;badge.textContent=label[report.state];
 details.replaceChildren();
 const heading=document.createElement('strong');heading.textContent='Branche main : '+label[report.main.state];details.append(heading);
 if(!report.main.workflows.length){const p=document.createElement('p');p.textContent='Aucun workflow récent trouvé sur main';details.append(p);}
 for(const run of report.main.workflows){addRow(details,run.name,run.state,run.commit,run.url);}
 const sub=document.createElement('strong');sub.className='subheading';sub.textContent='Pull requests ouvertes : '+report.pullRequests.prs.length;details.append(sub);
 if(!report.pullRequests.prs.length){const p=document.createElement('p');p.textContent='Aucune PR ouverte parmi les plus récentes';details.append(p);}
 for(const pr of report.pullRequests.prs){addRow(details,'#'+pr.number+' '+pr.title+(pr.draft?' (Draft)':''),pr.state,pr.head,pr.url);}
 if(report.pullRequests.truncated){const warning=document.createElement('p');warning.textContent='Historique limité : consulter GitHub pour les contrôles plus anciens.';details.append(warning);}
}
function addRow(parent,name,state,sha,url){
 const row=document.createElement('div');row.className='workflow';
 const heading=document.createElement(url?'a':'span');heading.textContent=name;
 if(url){heading.href=url;heading.target='_blank';heading.rel='noopener noreferrer';}
 const status=document.createElement('small');status.textContent=(label[state]||'Inconnu')+' · '+sha;row.append(heading,status);parent.append(row);
}
async function jsonRequest(repo,kind,signal){
 const response=await fetch(projectEndpoint(repo,kind),{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal});
 if(!response.ok){
  if(response.status===403||response.status===429)throw Error('Quota GitHub ou accès refusé');
  throw Error('GitHub HTTP '+response.status);
 }
 return response.json();
}
async function inspect(repo){
 const hit=cache.get(repo),now=Date.now();
 if(hit&&now-hit.checked<CACHE_MS)return {report:hit.report,cached:true};
 const {badge,details}=nodes.get(repo);badge.className='status unknown';badge.textContent='Chargement…';details.textContent='Interrogation publique GitHub…';
 // Each repository has 3 serial API requests to avoid exhausting GitHub's unauthenticated limit instantly.
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),16000);
 try{
  const main=await jsonRequest(repo,'main',controller.signal);
  const pulls=await jsonRequest(repo,'pulls',controller.signal);
  // No need to request PR checks if there are no open pull requests.
  const runs=pulls.length?await jsonRequest(repo,'pr-runs',controller.signal):{workflow_runs:[]};
  const report=summarizeProject(main,pulls,runs,{repo,now:Date.now()});
  cache.set(repo,{checked:Date.now(),report});
  return {report,cached:false};
 }finally{clearTimeout(timeout);}
}
async function refresh(){
 if(active)return;
 const now=Date.now();if(lastRefresh&&now-lastRefresh<60000){$('notice').textContent='Actualisation limitée à une fois par minute. Les états en cache restent affichés.';return;}
 active=true;lastRefresh=now;$('refresh').disabled=true;
 $('notice').textContent='Contrôle des workflows et pull requests publiques…';
 let next=0,failed=0,completed=0,cached=0;
 async function worker(){
  while(next<PROJECTS.length){
   const repo=PROJECTS[next++];
   try{const result=await inspect(repo);present(repo,result.report);if(result.cached)cached++;}
   catch(error){failed++;const {badge,details}=nodes.get(repo);badge.className='status unknown';badge.textContent='Inconnu';details.textContent='État non vérifiable : '+(error.name==='AbortError'?'délai dépassé':error.message);}
   completed++;$('notice').textContent=completed+' / '+PROJECTS.length+' projets vérifiés'+(failed?' · '+failed+' non vérifiable(s)':'')+'.';
  }
 }
 try{await Promise.all(Array.from({length:MAX_CONCURRENT},worker));$('stamp').textContent='Consulté le '+new Date().toLocaleString('fr-FR')+(cached?' · '+cached+' en cache':'');}
 finally{active=false;$('refresh').disabled=false;}
}
$('refresh').addEventListener('click',refresh);
refresh();
