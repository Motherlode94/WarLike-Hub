import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const base=new URL('../',import.meta.url),portfolio=JSON.parse(readFileSync(new URL('portfolio/warlike-applications.json',base),'utf8'));
test('all 32 accessible repos have unique names and valid GitHub links',()=>{
 assert.equal(portfolio.schema,'warlike-portfolio-v1');
 assert.equal(portfolio.scope.repositoryCount,32);
 assert.equal(portfolio.applications.length,32);
 assert.equal(new Set(portfolio.applications.map(x=>x.repository)).size,32);
 for(const app of portfolio.applications){assert.equal(app.repositoryUrl,'https://github.com/Motherlode94/'+app.repository);assert.ok(['P0','P1','P2'].includes(app.priority));assert.ok(app.nextCheck.length>15);assert.equal(app.productionVerified,false)}
});
test('critical apps and apps without README are represented honestly',()=>{
 const apps=portfolio.applications;
 for(const id of ['WarLike-Engine','WarLike-Studio','WarLike-Server','WarLike-Hub','WarLike-Rig-Studio','WarLike-Virtual-Idols','WarLike-Ebook','WarLike-Online','WarLike-Tower','WarLike-Heart','WarLike-Library','WarLike-Asset-Stores','WarLike-Android-Hub','WarLike-OSA','WarLike-OSW','GAME_HUB-v2','Music-Generator'])assert.ok(apps.some(x=>x.repository===id),id);
 assert.match(portfolio.scope.verification,/Aucun test end-to-end/);
});
test('portfolio page accessible and linked from Hub',()=>{
 const page=readFileSync(new URL('portefeuille.html',base),'utf8'),hub=readFileSync(new URL('index.html',base),'utf8'),js=readFileSync(new URL('portfolio/portfolio.js',base),'utf8');
 for(const id of ['cards','stats','query','priority','category','resultCount'])assert.ok(page.includes('id="'+id+'"'));
 assert.ok(hub.includes('portefeuille.html'));
 assert.ok(js.includes('textContent'));
 assert.ok(!js.includes('innerHTML'));
 assert.ok(page.includes('production'));
});
