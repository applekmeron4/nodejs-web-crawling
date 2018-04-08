import test from './test';

const t = new test();
t.foo();

const abc = () => console.log(new Date());

setInterval(abc, 1000);