// Isolated behavior tests for reviewed helpers; synthetic reserved examples only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalisePhone, resolveCountry } from '../src/lib/phone.ts';
import { normEmail, brauchtNormalisierung } from '../src/lib/normEmail.ts';
import { dedupeNachEmpfaenger } from '../src/lib/dedupeEmpfaenger.ts';

test('Italian geographic numbers keep the significant leading zero', () => {
  assert.deepEqual(normalisePhone('06 0000 0000', 'IT'), {ok:true, phone:'+390600000000'});
  assert.deepEqual(normalisePhone('030 0000 0000', 'DE'), {ok:true, phone:'+493000000000'});
});
test('unsafe spreadsheet numbers, extensions and invalid international prefixes are rejected', () => {
  for (const value of ['+02025550100', '+12025550100 ext 99', '1.23e+99', NaN, Infinity, {}]) {
    assert.equal(normalisePhone(value, 'US').ok, false, String(value));
  }
  assert.deepEqual(normalisePhone('1.20255501e+10', 'US'), {ok:true, phone:'+12025550100'});
});
test('an optional international trunk prefix is not silently dialled', () => {
  assert.equal(normalisePhone('+49 (0)30 0000 0000').ok, false);
});

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
