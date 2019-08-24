module.exports = {
  test: async function (req, res) {
    // res.send(sails.test.prop);
    sails.kmfCore.log('use KMF core to record log');
    res.send('test');
  }
}