'use strict';

const Hapi = require('@hapi/hapi');
const moment = require('moment');
const { request } = require('http');

var usersList = [
    {   
        login: "i.ivanov",
        last_update: "27.01.2024",
        status: ""
    },
    {
        login: "b.bocharov",
        last_update: "15.02.2024",
        status: ""
    },
    {
        login: "a.alex",
        last_update: "02.01.2024",
        status: ""
    },
    {
        login: "aaabbbccc",
        last_update: "28.02.2024",
        status: ""
    },
    {
        login: 'lfdfldf',
        last_update: "01.01.2024",
        status: ""
    }
]

const formatArray = (usersList) => {
    usersList.forEach((usersList) => {
        if(moment(usersList.last_update).add(process.env.EXPIRATION, 'months') < moment())
        {
            usersList.status = "expired";
        } else {
            usersList.status = "unexpired";
        }
    })
    return usersList;
};

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: { cors: true }
    });

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Hello World!';
            }
        },
        {
            method: 'GET',
            path: '/users',
            handler: (request, h) => {
                return usersList;
            }
        },
        {
            method: 'GET',
            path: '/getUpToDatePasswords',
            handler: (request, h) => {
                return formatArray(usersList);
            }
        }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();