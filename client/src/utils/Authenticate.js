import jwt_decode from 'jwt-decode'
const authenticate = () =>{
    let tokenValid  = true;
    let localToken = localStorage.getItem('example-app');

    if(localToken){
        const decode = jwt_decode(localToken)

        const currentTime = new Date().getTime() / 1000;

        if(currentTime > decode.exp){
            tokenValid = false;
            return tokenValid;
        }
        return tokenValid;
    }
    return null;
}

export default authenticate