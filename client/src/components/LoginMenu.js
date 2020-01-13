import React from 'react';
import { Button } from 'reactstrap';

const LoginMenu = () => {
    return (
        <div>
            <h1>You're Not EmpTea!</h1>
            <Button color="primary" href="https://discordapp.com/api/oauth2/authorize?client_id=580552424369160212&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify">
                Login To Discord
            </Button>
        </div>
    )
}

export default LoginMenu
