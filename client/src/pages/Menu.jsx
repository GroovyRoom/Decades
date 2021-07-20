import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import { style } from '@material-ui/core/colors';

const useStyles = makeStyles({
    body: {
        marginTop: 200,
    },

    button: {
        marginTop: 70,
        marginLeft: '39.5%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#B7F6FF',
        borderRadius: 36,
        fontSize: 24,
        maxWidth: 160,
        padding: '14px 160px',
        "&:hover": {
            backgroundColor: '#B7F6FF',
            boxShadow: '0 8px 16px 0 #626262, 0 6px 20px 0 #626262'
        }
    },
});

const Menu = () => {
    const classes = useStyles();
    const handleClickPlay = () => {
        console.log('play cliked');
    }
    const handleClickCreate = () => {
        console.log('create clicked');
    }

    return (
        <div className={classes.body}>
            <Button onClick={handleClickPlay} className={classes.button} >Play</Button>
            <Button onClick={handleClickCreate} className={classes.button}>Create</Button>
        </div>
    );
}

export default Menu;