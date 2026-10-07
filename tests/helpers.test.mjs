// Isolated behavior tests for reviewed helpers; synthetic reserved examples only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalisePhone, resolveCountry } from '../src/lib/phone.ts';
import { normEmail, brauchtNormalisierung } from '../src/lib/normEmail.ts';
import { dedupeNachEmpfaenger } from '../src/lib/dedupeEmpfaenger.ts';

test('unknown country context is rejected instead of guessed', () => {
  assert.equal(normalisePhone('2025550100').ok, false);
  assert.deepEqual(normalisePhone('2025550100', 'US'), {ok:true, phone:'+12025550100'});
});
test('international input and common country spelling are normalized', () => {
  assert.deepEqual(normalisePhone('0012025550100'), {ok:true, phone:'+12025550100'});
  assert.equal(resolveCountry('Österreich'), 'AT');
  assert.equal(resolveCountry('UK'), 'GB');
  assert.equal(normalisePhone('+123').ok, false);
});
test('email wrappers are removed and local-part case is preserved', () => {
  assert.equal(normEmail('Demo Contact <mailto:Demo@example.com?subject=demo>'), 'Demo@example.com');
  assert.equal(normEmail('mailto:mailto:demo%40example.org'), 'demo@example.org');
  assert.equal(normEmail('  '), null);
  assert.equal(brauchtNormalisierung('demo@example.org'), false);
});
test('recipient deduplication preserves first item and original order', () => {
  const rows=[{id:'demo-a',email:'DEMO@example.com'}, {id:'demo-b',email:' demo@example.com '}, {id:'demo-c',email:'other@example.org'}, {id:'demo-d',email:null}];
  const result=dedupeNachEmpfaenger(rows, row=>row.email);
  assert.deepEqual(result.behalten.map(x=>x.id),['demo-a','demo-c','demo-d']);
  assert.deepEqual(result.verworfen.map(x=>x.id),['demo-b']);
});
