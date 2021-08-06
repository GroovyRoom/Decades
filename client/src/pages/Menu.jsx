import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  body: {
    marginTop: 200,
  },

  button: {
    marginTop: 70,
    marginLeft: "39.5%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#B7F6FF",
    borderRadius: 36,
    fontSize: 24,
    maxWidth: 160,
    padding: "14px 160px",
    "&:hover": {
      backgroundColor: "#B7F6FF",
      boxShadow: "0 8px 16px 0 #626262, 0 6px 20px 0 #626262",
    },
  },
});

const Menu = (props) => {
  const history = useHistory();

  const classes = useStyles();
  const handleClickPlay = () => {
    history.push("/play");
  };
  const handleClickCreate = () => {
    history.push("/create");
  };

  return (
    <div className={classes.body}>
      <Button onClick={handleClickPlay} className={classes.button}>
        Play
      </Button>
      <Button onClick={handleClickCreate} className={classes.button}>
        Create
      </Button>
      <Button
        className={classes.button}
        onClick={() => {
          const requestOptions = {
            method: "POST",
          };

          fetch(`/api/auth/logout`, requestOptions).then((response) =>
            props.logoutHandler()
          );
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Menu;
