import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { updateProfile, updatePassword } from '../../redux_modules/auth';
import { createTeam, joinTeam } from '../../redux_modules/competition';
import { media } from '../../common/theme';
import Card from '../../components/Card';
import InputIcon from '../../components/InputIcon';
import LoadingButtonComponent from '../../components/LoadingButtonComponent';

// Assets
import logoCITD from '../../assets/logo-citd.png';
import logoIPSC from '../../assets/logo-ipsc.png';
import logoCTF from '../../assets/logo-ctf.png';
import logoUIUX from '../../assets/logo-uiux.png';

const IPSC_RULEBOOK_URL = 'https://drive.google.com/ipsc';
const CITD_RULEBOOK_URL = 'https://drive.google.com/ipsc';
const UIUX_RULEBOOK_URL = 'https://drive.google.com/ipsc';
const CTF_RULEBOOK_URL = 'https://drive.google.com/ipsc';

@connect(
  state => ({
    auth: state.auth,
    competition: state.competition,
  }),
  { createTeam, joinTeam }
)
export default class Competitions extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    competition: PropTypes.object.isRequired,
    createTeam: PropTypes.object.isRequired,
    joinTeam: PropTypes.object.isRequired,
  };

  static COMPETITIONS = {
    IPSC: {
      code: 'ipsc',
      title: 'Internal Problem Solving Competition',
      logo: logoIPSC,
      rulebookURL: IPSC_RULEBOOK_URL,
    },
    CTF: {
      code: 'ctf',
      title: 'Capture the Flag with Dewaweb',
      logo: logoCTF,
      rulebookURL: CTF_RULEBOOK_URL,
    },
    CITD: {
      code: 'citd',
      title: 'Code in the Dark',
      logo: logoCITD,
      rulebookURL: CITD_RULEBOOK_URL,
    },
    UIUX: {
      code: 'uiux',
      title: 'UI/UX',
      logo: logoUIUX,
      rulebookURL: UIUX_RULEBOOK_URL,
    },
  };

  static INITIAL_STATE = {
    hasFocus: false,
    active: {
      code: null,
      title: null,
    },
    name: '',
    token: '',
    // Button Flags
    isJoinTeamButtonClicked: false,
    isCreateTeamButtonClicked: false,
  };

  constructor() {
    super();
    this.state = Object.assign({}, Competitions.INITIAL_STATE);
  }

  setAsActive(competition) {
    this.setState({ active: competition, hasFocus: true });
  }

  clearActive() {
    this.setState({
      ...Competitions.INITIAL_STATE,
    });
  }

  handleInputChange(event) {
    const { name: field, value } = event.target;
    this.setState({ [field]: value });
  }

  async submitJoinTeam(event) {
    event.preventDefault();
    this.setState({ isJoinTeamButtonClicked: true });
    await this.props.joinTeam({ token: this.state.token });
    this.setState({ isJoinTeamButtonClicked: false });
  }

  async submitCreateTeam(event) {
    event.preventDefault();
    this.setState({ isCreateTeamButtonClicked: true });
    await this.props.createTeam({ competition: this.state.active.code, name: this.state.name });
    this.setState({ isCreateTeamButtonClicked: false });
  }

  render() {
    const competition = Competitions.COMPETITIONS;
    const { hasFocus } = this.state;
    const { hasRegistered } = this.props.competition;
    return (
      <Container>
        {!hasFocus &&
          Object.keys(competition).map(key =>
            <Card key={competition[key].title} width="25%">
              <div className="top">
                <img src={competition[key].logo} alt={`logo ${competition[key].title}`} />
                <span className="title">
                  {competition[key].title}
                </span>
              </div>
              <div className="bottom">
                <Button
                  onClick={() =>
                    this.setAsActive({ code: competition[key].code, title: competition[key].title })}
                >
                  Join now
                </Button>
                <a href={competition[key].rulebookURL} target="_blank">
                  Download Rulebook
                </a>
              </div>
            </Card>
          )}
        {hasFocus &&
          hasRegistered &&
          <Card width="100%">
            <span className="title">
              {this.state.active.title}
            </span>
            <div className="alert-message">You have joined this competition</div>
            <div className="team-name">
              {this.props.competition.name}
            </div>
            <div className="team-token">
              Your token is: {this.props.competition.token}
            </div>
            <div className="team-members">
              Team members:
              {this.props.competition.members &&
                this.props.competition.members.map(member =>
                <div className="team-member">
                  {`${member.first_name} ${member.last_name}`}
                </div>
              )}
            </div>
          </Card>}
        {hasFocus &&
          !hasRegistered &&
          <Card width="100%">
            <span className="title">
              {this.state.active.title}
            </span>
            <Form>
              <FormGroup>
                <ControlLabel>Join a team</ControlLabel>
                <FormControl
                  name="token"
                  onChange={e => this.handleInputChange(e)}
                  placeholder="enter token team here"
                  value={this.state.token}
                />
                <Button
                  bsStyle="success"
                  disabled={this.props.competition.loading}
                  onClick={e => this.submitJoinTeam(e)}
                >
                  {this.state.isJoinTeamButtonClicked && <LoadingButtonComponent />}
                  {!this.state.isJoinTeamButtonClicked && 'Submit'}
                </Button>
              </FormGroup>
            </Form>
            <Form>
              <FormGroup>
                <ControlLabel>Create a team</ControlLabel>
                <FormControl
                  name="name"
                  onChange={e => this.handleInputChange(e)}
                  placeholder="enter team name here"
                  value={this.state.name}
                />
                <Button
                  bsStyle="success"
                  disabled={this.props.competition.loading}
                  onClick={e => this.submitCreateTeam(e)}
                >
                  {this.state.isCreateTeamButtonClicked && <LoadingButtonComponent />}
                  {!this.state.isCreateTeamButtonClicked && 'Submit'}
                </Button>
              </FormGroup>
            </Form>
          </Card>}
      </Container>
    );
  }
}

const Container = styled(({ column, ...props }) => <div {...props} />)`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  ${props => props.column && 'flex-direction: column;'}
  ${media('mobile')} {
    flex-direction: column;
  }
  ${Card} {
    align-items: center;
    align-self: center;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 20rem;
    justify-content: space-between;
    text-align: center;
    .title {
      text-transform: uppercase;
      font-family: ${props => props.theme.font.jaapokki};
      align-self: center;
      font-size: ${props => props.theme.size.font.medium};
    }
    .top {
      display: flex;
      flex-direction: column;
      img {
        height: 5rem;
        align-self: center;
        object-fit: scale-down;
        margin: 2rem 0 1rem 0;
      }
      .title {
        align-self: stretch;
      }
    }
    .bottom {
      display: flex;
      flex-direction: column;
    }
    ${media('mobile')} {
      width: 80%;
    }
  }
`;