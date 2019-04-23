var str = '0123'

console.log(/^(?:@[a-z0-9-~][a-z0-9-._~]*)?[a-z0-9-~][a-z0-9-._~]*$/.test(str))