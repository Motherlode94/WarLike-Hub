import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 const now=new Date().toISOString(),sha='f'.repeat(40);
 const good={name:'Build',event:'push',status:'completed',conclusion:'success',created_at:now,updated_at:now,head_sha:sha,html_url:'https://github.com/Motherlode94/WarLike-Engine/actions/runs/1'};
 await page.route('https://api.github.com/repos/**',async route=>{
  const url=new URL(route.request().url()),parts=url.pathname.split('/'),repo=parts[3];
  const main=url.searchParams.get('branch')==='main',pulls=parts[4]==='pulls',prRuns=url.searchParams.get('event')==='pull_request';
  const headers={'access-control-allow-origin':'*','content-type':'application/json'};
  if(repo==='WarLike-Studio'){await route.fulfill({status:403,headers,body:JSON.stringify({message:'rate limited'})});return;}
  if(pulls){await route.fulfill({status:200,headers,body:JSON.stringify(repo==='WarLike-Engine'?[{number:32,title:'Animator',updated_at:now,head:{sha},draft:true,html_url:'https://github.com/Motherlode94/WarLike-Engine/pull/32'}]:[])});return;}
  if(main){await route.fulfill({status:200,headers,body:JSON.stringify({workflow_runs:[good]})});return;}
  if(prRuns){await route.fulfill({status:200,headers,body:JSON.stringify({workflow_runs:[{...good,event:'pull_request',name:'PR tests',conclusion:'failure'}]})});return;}
  await route.abort();
 });
 await page.goto('http://127.0.0.1:8765/qa-lab.html',{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelector('#notice')?.textContent?.includes('12 / 12'),{timeout:20000});
 const card=page.locator('.project').filter({has:page.getByRole('heading',{name:'WarLike-Engine'})});
 assert.equal(await card.locator('.status').text(),'Échec','a failing PR must override passing main');
 assert.match(await card.locator('.details').innerText(),/Pull requests ouvertes : 1/);
 assert.match(await card.locator('.details').innerText(),/PR tests|#32 Animator/);
 const studio=page.locator('.project').filter({has:page.getByRole('heading',{name:'WarLike-Studio'})});
 assert.equal(await studio.locator('.status').text(),'Inconnu','rate limited API cannot be green');
 assert.equal(await page.locator('.project').count(),12);
 await page.getByRole('button',{name:'Actualiser les vérifications'}).click();
 assert.match(await page.locator('#notice').textContent(),/une fois par minute/);
 assert.deepEqual(errors,[]);
 console.log('PASS: QA Lab browser mock validates open PR failure, 403 unknown, cards and throttled refresh');
}finally{await browser.close()}
