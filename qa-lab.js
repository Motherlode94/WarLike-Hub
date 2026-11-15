import {PROJECTS,projectEndpoint,summarizeRuns,OWNER} from './qa-core.js';
const $=id=>document.getElementById(id);
const label={success:'Réussi',failure:'Échec',running:'En cours',unknown:'Inconnu',other:'Non concluant'};
const nodes=new Map();
for(const repo of PROJECTS){
 const card=document.createElement('article');card.className='project';
 const heading=document.createElement('h3');heading.textContent=repo;
 const badge=document.createElement('span');badge.className='status unknown';badge.textContent='Non vérifié';
 const title=document.createElement('div');title.className='projectHead';title.append(heading,badge);
 const details=document.createElement('div');details.className='details';details.textContent='Aucune vérification effectuée';
 const link=document.createElement('a');link.href='https://github.com/'+OWNER+'/'+repo+'/actions';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Ouvrir GitHub Actions ↗';
 card.append(title,details,link);$('projects').append(card);nodes.set(repo,{badge,details});
}
let active=false;
async function refresh(){
 if(active)return;active=true;$('refresh').disabled=true;$('notice').textContent='Vérification GitHub en cours…';
 let remaining=PROJECTS.length,failed=0;
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 async function inspect(repo){
  const {badge,details}=nodes.get(repo);
  badge.className='status unknown';badge.textContent='Chargement…';
  try{
   const response=await fetch(projectEndpoint(repo),{headers:{Accept:'application/vnd.github+json'},cache:'no-store',signal:controller.signal});
   if(!response.ok)throw Error(response.status===403||response.status===429?'Quota GitHub ou accès refusé':'GitHub HTTP '+response.status);
   const report=summarizeRuns(await response.json());
   badge.className='status '+report.state;badge.textContent=label[report.state];
   details.replaceChildren();
   if(!report.workflows.length){details.textContent='Aucune exécution push, planifiée ou manuelle trouvée sur main';return;}
   for(const run of report.workflows){
    const row=document.createElement('div');row.className='workflow';
    const name=document.createElement(run.url?'a':'span');name.textContent=run.name;if(run.url){name.href=run.url;name.target='_blank';name.rel='noopener noreferrer';}
    const status=document.createElement('small');status.textContent=label[run.state]+' · '+run.commit;
    row.append(name,status);details.append(row);
   }
  }catch(e){failed++;badge.className='status unknown';badge.textContent='Inconnu';details.textContent='État non vérifiable : '+(e.name==='AbortError'?'délai dépassé':e.message);}
  finally{remaining--;$('notice').textContent=remaining?remaining+' dépôt(s) restant(s)…':failed?failed+' dépôt(s) non vérifiable(s) ; aucun statut vert supposé.':'Vérification publique terminée.';}
 }
 try{await Promise.all(PROJECTS.map(inspect));$('stamp').textContent='Consulté le '+new Date().toLocaleString('fr-FR');}
 finally{clearTimeout(timeout);active=false;$('refresh').disabled=false;}
}
$('refresh').addEventListener('click',refresh);refresh();
