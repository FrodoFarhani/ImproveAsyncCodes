var request=require('request');

describe("calc",()=>{
    it('should calculate 2*2...', () => {
        expect(2*2).toBe(4);
    });
})
describe("get messages",()=>{
    it('should get 200 in response', (done) => {
        request.get('http://localhost:3000/messages',(err,res)=>{
            expect(res.statusCode).toEqual(200);
            done();
            
        });
    });
    it('should get not empty list', (done) => {
        request.get('http://localhost:3000/messages',(err,res)=>{
            expect(JSON.parse(res.body).length).toBeGreaterThan(0);
            done();
            
        });
    });
});


describe("get messages specific user",()=>{
    beforeAll(function () {
        request.post({url:'http://localhost:3000/messages',form:{name:"tom",message:"hi there"}},function(err,httpResponse,body){
           // console.log("tom message saved!",body);
        });
    });
   
    it('should get 200 in response', (done) => {
        request.get('http://localhost:3000/messages/tom',(err,res)=>{
            expect(res.statusCode).toEqual(200);
            done();
            
        });
    });
    it('should get tim messages', (done) => {
        request.get('http://localhost:3000/messages/tom',(err,res)=>{
            expect(JSON.parse(res.body)[0].name).toBe('tom');
            done();
            
        });
    });
});