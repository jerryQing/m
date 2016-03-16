# m2012server

Muitiple process solution of Loading Welcome Page.

features:

* muitiple process
* file logging.
* multi-platform support

NOTE: 

Do not use `start.js` or `restart.js` in node-webkit under 0.10.x, since `child-process` is not supported,
you may use `require('app.js')` instead.


## usage

first, unpack the zip file, and enter the `m2012server` directory.
to enable multi-process, you could run the following command:

```bash
node restart
```

and also a single-process version is available:

```bash
node ./server/app
```

## run on node-webkit (windows only) ##

you may also run the app on node-webkit 0.10.x or higher, just drag the `


## Documentation

todo

## License

None
