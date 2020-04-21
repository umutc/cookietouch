import LanguageManager from "@/configurations/language/LanguageManager";
import AppBar from "@material-ui/core/AppBar";
import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import firebase from "firebase/app";
import React from "react";
import {
  bottomAppBarStyles,
  IBottomAppBarProps,
  IBottomAppBarState
} from "renderer/pages/BottomAppBar/types";

class BottomAppBar extends React.Component<
  IBottomAppBarProps,
  IBottomAppBarState
> {
  public state: IBottomAppBarState = {
    botsConnected: 0,
    totalUsers: 0,
    usersConnected: 0
  };

  public componentDidMount() {
    firebase
      .firestore()
      .doc("/stats/users")
      .onSnapshot(snap => {
        const users = {
          ...snap.data(),
          connected: 0
        };
        this.setState({ botsConnected: users!.connected });
      });
    const listRef = firebase.database().ref("status");
    listRef.on("value", snap => {
      if (!snap) {
        return;
      }
      let num = 0;
      snap.forEach(x => {
        if (x.val().state === "online") {
          num++;
        }
        return false;
      });
      this.setState({
        totalUsers: snap.numChildren(),
        usersConnected: num
      });
    });
  }

  public render() {
    const { classes } = this.props;
    const { totalUsers, usersConnected } = this.state;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar} position="sticky">
          <Toolbar className={classes.toolbar}>
            <Typography variant="subtitle1" color="inherit">
              {LanguageManager.trans(
                "usersConnected",
                usersConnected,
                totalUsers,
                "X"
              )}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(bottomAppBarStyles)(BottomAppBar);
