import axios from 'axios';

export function getFromStorage(key){
    if(!key) return null;
    try{
        const valueStr = localStorage.getItem(key);
        if(valueStr) return JSON.parse(valueStr);
        return null;
    }
    catch(err){ 
        return null; 
    }
}
  
export function setInStorage(key, value){
    if(!key) console.log('Error: Key is missing');
    try{
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch(err){ 
        return null; 
    }
}

export function generateRandomString() {
    const rand = Math.floor(Math.random() * 10);
    let randStr = '';
    for (let i = 0; i < 20 + rand; i++) {
        randStr += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }
    return randStr;
}

export function getToken(method, code){
    return axios.post('/api/token', { method, code })
      .then(res => {
        const { data } = res;
        if(data.success){
            // Calculate token expiry date
            let d = new Date();
            d.setDate(d.getDate()+7);

            console.log('Saved token in local storage!');
            setInStorage('token', data.token);
            setInStorage('expires', JSON.stringify(d));
            setInStorage('refresh', data.refresh_token);
            return data.token;
        }
        else throw data.message;
      })
      .catch(err => {
        if (err) console.log(err);
        else console.log('Error: Error when using access code for token');
      });
  }