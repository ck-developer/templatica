module.exports = 'Page title is correct': (test) ->
  test.open('http://localhost.com').assert.title().is('Google', 'It has title').done()
  return