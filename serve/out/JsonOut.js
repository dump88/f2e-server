const zlib = require('zlib')
module.exports = (fn, conf = {}) => (req, resp) => {
    let out = data => resp.end(JSON.stringify(data))
    let header = {
        'Content-Type': 'application/json; charset=utf-8'
    }
    if (conf.gzip) {
        header['Content-Encoding'] = 'gzip'
        out = data => resp.end(zlib.gzipSync(JSON.stringify(data)))
    }
    resp.writeHead(200, header)
    const res = fn(req, resp)
    if (res instanceof Promise) {
        res.then(data => {
            out(data)
        }).catch(e => {
            out(e)
        })
    } else {
        out(res)
    }
    return false
}
