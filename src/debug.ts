import * as Argsert from './argsert';

const argsert = Argsert.configure({
  // onError: false
});

function addUser(name, age?, email?) {
  const result = argsert.assert('<string> <age:string|number> [string]', arguments);
  const t = 'test';
}

addUser('bob', 'should be number');

const t = 'test';



