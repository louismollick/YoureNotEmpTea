import React from 'react';
import { Button } from 'reactstrap';

const LoginMenu = () => {
    const href = `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_SERVER_URI)}&response_type=code&scope=identify`;
    return (
        <div>
            <h1>You're Not EmpTea!</h1>
            <Button color="primary" href={href}>
                Login To Discord
            </Button>
        </div>
    )
}

export default LoginMenu
