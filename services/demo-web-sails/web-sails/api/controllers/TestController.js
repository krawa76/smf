module.exports = {
  test: async function (req, res) {
    // res.send(sails.test.prop);
    sails.smfCore.log('use SMF core to record log');
    res.send('test');
  }
}