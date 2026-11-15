const $=id=>document.getElementById(id);
const labels={creation:'Création',infra:'Infrastructure',community:'Communauté',assets:'Ressources',games:'Jeux',education:'Formation',platform:'Plateformes',security:'Sécurité',utility:'Utilitaires'};
function elt(tag,txt,cls){const n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n}
function makeCard(item){
 const box=elt('article',undefined,'card'),meta=elt('div',undefined,'meta');
 meta.append(elt('span',labels[item.category]||item.category),elt('span',item.priority,'tag'));
 box.append(meta,elt('h3',item.repository),elt('p',item.role));
 box.append(elt('p','Prochaine validation : '+item.nextCheck,'next'));
 box.append(elt('p','Dépendances : '+item.dependencies));
 const link=elt('a','Voir le dépôt GitHub','repo');link.href=item.repositoryUrl;link.target='_blank';link.rel='noopener noreferrer';box.append(link);
 return box;
}
function render(items){
 const search=$('query').value.trim().toLocaleLowerCase('fr'),category=$('category').value,priority=$('priority').value;
 const filtered=items.filter(x=>(category==='all'||x.category===category)&&(priority==='all'||x.priority===priority)&&[x.repository,x.role,x.nextCheck,x.dependencies].join(' ').toLocaleLowerCase('fr').includes(search));
 const holder=$('cards');holder.replaceChildren();
 for(const item of filtered)holder.append(makeCard(item));
 if(!filtered.length)holder.append(elt('p','Aucun dépôt ne correspond aux filtres.','empty'));
 $('resultCount').textContent=filtered.length+' / '+items.length+' dépôts affichés';
}
async function start(){
 try{
  const response=await fetch('./portfolio/warlike-applications.json',{cache:'no-store'});if(!response.ok)throw Error('Inventaire inaccessible.');
  const payload=await response.json();if(payload.schema!=='warlike-portfolio-v1'||!Array.isArray(payload.applications))throw Error('Format de registre incorrect.');
  const items=payload.applications;
  const stat=$('stats');
  for(const [value,label] of [[items.length,'Dépôts inventoriés'],[items.filter(x=>x.priority==='P0').length,'Priorité P0'],[items.filter(x=>x.priority==='P1').length,'Priorité P1'],[items.filter(x=>x.productionVerified).length,'Productions validées ici']]){
   const pair=elt('div');pair.append(elt('strong',value),elt('span',label));stat.append(pair);
  }
  $('updated').textContent='Revue documentaire : '+payload.reviewedAt+' · Aucun contrôle de production en direct.';
  for(const id of ['query','category','priority'])$(id).addEventListener(id==='query'?'input':'change',()=>render(items));
  render(items);
 }catch(error){
  $('resultCount').textContent='Impossible de charger l’inventaire : '+error.message;
  $('cards').append(elt('p','Consulte les dépôts directement sur GitHub depuis le Hub.','empty'));
 }
}
start();
