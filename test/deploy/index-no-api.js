import test from 'ava'
import td from '../helpers/testdouble'

const functions = 'foo-*'
const uploadedFuncs = ['foo', 'bar']
const env = 'beta'
const bucket = 's3_bucket'

const build = td.replace('../../src/util/build-functions')
const apiGateway = td.replace('../../src/util/aws/api-gateway')
const promoteAliases = td.replace('../../src/util/promote-aliases')
const setPermissions = td.replace('../../src/util/set-permissions')
const push = td.replace('../../src/util/push-api')

const load = td.replace('../../src/util/load')
td.when(load.api()).thenResolve()

const uploadBuilds = td.replace('../../src/util/upload-builds')
td.when(uploadBuilds(functions, bucket)).thenResolve(uploadedFuncs)

const upload = td.replace('../../src/util/upload-functions')
td.when(upload(uploadedFuncs, env)).thenResolve(uploadedFuncs)

test.before(() => {
  const shep = require('../../src/index')
  return shep.deploy({ env, functions, bucket, quiet: true })
})

test('Builds functions', () => {
  td.verify(build(functions, env))
})

test('Does not deploy API', () => {
  td.verify(apiGateway.deploy(), { times: 0, ignoreExtraArgs: true })
})

test('Does not push API defenitin', () => {
  td.verify(push(), { times: 0, ignoreExtraArgs: true })
})

test('Does promote function aliases', () => {
  td.verify(promoteAliases(functions, env))
})

test('Does not setup function permissions', () => {
  td.verify(setPermissions(), { times: 0, ignoreExtraArgs: true })
})
