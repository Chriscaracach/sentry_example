const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchUsers() {
  await delay(300);
  return [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'viewer' },
  ];
}

export async function simulateCrash() {
  await delay(200);
  throw new Error('Intentional crash (simulated)');
}

export async function simulateHandledError() {
  await delay(200);
  JSON.parse('not valid json {{');
}

export async function simulateSlowOperation() {
  await delay(1500);
  return { duration: '~1500ms' };
}
