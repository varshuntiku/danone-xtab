import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import PermIdentity from "@material-ui/icons/PermIdentity";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";

import userProfileStyles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.jsx";

import CodexDataProvider, {
  CODEX_API_GET
} from "views/CRUD/CodexDataProvider.jsx";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.setUserInfo = this.setUserInfo.bind(this);

    this.state = {};
  }

  componentDidMount() {
    CodexDataProvider(
      CODEX_API_GET,
      {
        resource: "user",
        action: "get-info",
        callback: "setUserInfo"
      },
      this
    );
  }

  setUserInfo = (crud, user_info) => {
    this.setState({ user_info: user_info.data });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <PermIdentity />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Profile - <small>From Active Directory</small>
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        value:
                          this.state.user_info && this.state.user_info.username
                            ? this.state.user_info.username
                            : "--"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Email address"
                      id="email-address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        value:
                          this.state.user_info && this.state.user_info.username
                            ? this.state.user_info.username
                            : "--"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      id="first-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        value:
                          this.state.user_info &&
                          this.state.user_info.first_name
                            ? this.state.user_info.first_name
                            : "--"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Last Name"
                      id="last-name"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true,
                        value:
                          this.state.user_info && this.state.user_info.last_name
                            ? this.state.user_info.last_name
                            : "--"
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card profile>
              <CardBody profile>
                <h6 className={classes.cardCategory}>ACCESS KEY</h6>
                <h4 className={classes.cardTitle}>
                  {this.state.user_info && this.state.user_info.access_key
                    ? this.state.user_info.access_key
                    : "--"}
                </h4>
                <p className={classes.description}>
                  Use this ACCESS KEY along with your <br/>
                  Jupyter notebook MATH MARKET api calls.
                </p>
                <Button color="rose" round>
                  Download example notebook
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(userProfileStyles)(UserProfile);
