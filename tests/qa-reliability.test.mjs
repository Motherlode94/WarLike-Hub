import test from 'node:test';
import assert from 'node:assert/strict';
import {projectEndpoint,summarizeRuns,summarizePullRequests,summarizeProject,MAX_AGE_MS,PROJECTS} from '../qa-core.js';
const NOW=Date.parse('2026-11-16T12:00:00Z');
const run=(name,conclusion,extra={})=>({name,conclusion,status:'completed',event:'push',updated_at:new Date(NOW-1000).toISOString(),created_at:new Date(NOW-2000).toISOString(),head_sha:'a'.repeat(40),html_url:'https://github.com/Motherlode94/WarLike-Engine/actions/runs/100',...extra});
const pr=(number,sha)=>({number,title:'Add animator',head:{sha},updated_at:new Date(NOW-2000).toISOString(),html_url:'https://github.com/Motherlode94/WarLike-Engine/pull/'+number,draft:false});
test('allowed endpoints support branch, open PRs and PR checks only',()=>{
 assert.equal(projectEndpoint('WarLike-Engine','pulls').includes('state=open'),true);
 assert.equal(projectEndpoint('WarLike-Engine','pr-runs').includes('event=pull_request'),true);
 assert.throws(()=>projectEndpoint('WarLike-Engine','secrets'),TypeError);
 assert.throws(()=>projectEndpoint('Other-Repo','main'),TypeError);
 assert.equal(PROJECTS.length,12);
});
test('a seven-day-old successful check is stale, not green',()=>{
 const success=run('Build','success',{updated_at:new Date(NOW-MAX_AGE_MS-1000).toISOString()});
 const result=summarizeRuns({workflow_runs:[success]},{now:NOW});
 assert.equal(result.state,'stale');
});
test('checks from the future and missing timestamps never produce green',()=>{
 for(const timestamp of ['',new Date(NOW+120000).toISOString()]){
  const result=summarizeRuns({workflow_runs:[run('Test','success',{updated_at:timestamp,created_at:timestamp})]},{now:NOW});
  assert.notEqual(result.state,'success');
 }
});
test('pull request failed checks override otherwise passing main workflows',()=>{
 const sha='b'.repeat(40);
 const result=summarizeProject(
  {workflow_runs:[run('Build','success')]},
  [pr(9,sha)],
  {workflow_runs:[run('Animator','failure',{head_sha:sha,event:'pull_request'})]},
  {repo:'WarLike-Engine',now:NOW}
 );
 assert.equal(result.main.state,'success');assert.equal(result.pullRequests.state,'failure');assert.equal(result.state,'failure');
});
test('missing PR checks are unknown instead of passing; old PR is stale',()=>{
 const sha='b'.repeat(40);
 const r=summarizePullRequests([pr(9,sha)],{workflow_runs:[]},{now:NOW});
 assert.equal(r.state,'unknown');assert.equal(r.prs[0].state,'unknown');
 const old={...pr(3,sha),updated_at:new Date(NOW-MAX_AGE_MS-1).toISOString()};
 assert.equal(summarizePullRequests([old],{workflow_runs:[]},{now:NOW}).state,'stale');
});
test('most recent run wins even when GitHub returns out-of-order results',()=>{
 const older=run('Build','failure',{updated_at:new Date(NOW-30000).toISOString()});
 const newer=run('Build','success',{updated_at:new Date(NOW-2000).toISOString()});
 assert.equal(summarizeRuns({workflow_runs:[older,newer]},{now:NOW}).state,'success');
});
test('untrusted workflow URL is never clickable',()=>{
 const r=summarizeRuns({workflow_runs:[run('Test','success',{html_url:'https://evil.test/'})]},{now:NOW});
 assert.equal(r.workflows[0].url,null);
});
