export class CustomError extends Error {
        constructor(message, statusCode=500){
            super(message);
            this.statusCode = statusCode;
            this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
            
        }

}