/*
 * --------------------------
 * MCStatus | Routes - Index
 * --------------------------
 */

 // Dependencies
 const express = require('express');
 const router = express.Router();
 const net = require('net')

 /* GET home page. */
 router.get('/', (req, res, next) => {
   let server_info = {}

   const port = req.query.port && req.query.port.length > 0 ? req.query.port : false;
   const address = req.query.address && req.query.address.length > 0 ? req.query.address : false;

   if (address) {
     let client = new net.Socket();
     let data
     let error

     client.connect(port ? port : 25565, address, () => {
       console.log('Connected to requested minecraft server...')
       client.write(Buffer.from([ 0xFE, 0x01 ]))
     })

     client.on('data', d => {
       data = d.toString()
       client.destroy()
     })

     client.on('error', error_msg => {
       error = error_msg
     })

     client.on('close', () => {
       console.log('Connection closed.')
       if (!error) {
         server_info.status = 'SUCCESS'
         server_info.online = data ? true : false
         server_info.motd = data ? data.split('\x00\x00\x00')[3].replace(/\u0000/g, '') : null
         server_info.players = {}
         server_info.players.max = data ? Number(data.split('\x00\x00\x00')[5].replace(/\u0000/g, '')) : null
         server_info.players.now = data ? Number(data.split('\x00\x00\x00')[4].replace(/\u0000/g, '')) : null
         server_info.server = {}
         server_info.server.version = data ? data.split('\x00\x00\x00')[2].replace(/\u0000/g, '') : null
       } else {
         server_info.status = 'ERROR'
         server_info.error = error
       }
       res.json(server_info)
     })
   } else {
     server_info.status = 'ERROR'
     server_info.error = 'Server address could not be resolved.'
     res.json(server_info)
   }
   //res.json(server_info)
 });

 router.get('/example', (req, res, next) => {
   res.render('index')
 });

 // Export Routes
 module.exports = router;
