import React from 'react';
import CurrentUsersAvatars from './CurrentUsersAvatars';
import { emit_change_codx_collab, init_codx_collab, stop_codx_collab } from '../util/collab_work';
import PropTypes from 'prop-types';
import { UserInfoContext } from '../context/userInfoContent';

class CodxCollabWork extends React.Component {
    static contextType = UserInfoContext;
    constructor(props) {
        super(props);
        this.emitChange = this.debounce(this.emitChangeCodxCollab, 1500);
        this.state = {
            participants: [],
            serializedData:
                typeof props.state === 'object' ? JSON.stringify(props.state) : props.state,
            tokenRecived: false
        };
    }
    emitChangeCodxCollab = (room, state) => {
        emit_change_codx_collab(room, state);
    };
    debounce = (cb, delay) => {
        let timer;
        return (...args) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                cb.apply(this, args);
            }, delay);
        };
    };

    componentDidMount() {
        this.initCollab();
    }

    initCollab = () => {
        if (!this.props.disabled) {
            init_codx_collab({
                key: this.props.room,
                user_email: this.props?.user_email || this.context?.username,
                user_first_name: this.props?.user_first_name || this.context?.first_name,
                user_last_name: this.props?.user_second_name || this.context?.last_name,
                onParticipants: (users) => {
                    this.setState({
                        participants: users
                    });
                    if (this.props.onParticipants) {
                        this.props.onParticipants(users);
                    }
                },
                getState: () => this.props.state,
                onStateChange: (new_state) => {
                    this.setState({
                        serializedData:
                            typeof new_state === 'object' ? JSON.stringify(new_state) : new_state
                    });
                    if (this.props.onStateChange) {
                        this.props.onStateChange(new_state);
                    }
                },
                onToken: () => {
                    this.setState({
                        tokenRecived: true
                    });
                }
            });
        }
    };

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.state) !== JSON.stringify(this.props.state)) {
            if (JSON.stringify(this.props.state) !== this.state.serializedData) {
                this.setState({
                    serializedData:
                        typeof this.props.state === 'object'
                            ? JSON.stringify(this.props.state)
                            : this.props.state
                });
                this.emitChange(this.props.room, this.props.state);
            }
        }

        if (prevProps.disabled !== this.props.disabled) {
            if (this.props.disabled) {
                stop_codx_collab(this.props.room);
            } else {
                this.initCollab();
            }
        }
    }

    componentWillUnmount() {
        stop_codx_collab(this.props.room);
    }

    render() {
        const { hideCurrentUsersAvatars, currentUserAvatarProps, disabled } = this.props;
        if (hideCurrentUsersAvatars || disabled) {
            return null;
        }
        return (
            <CurrentUsersAvatars
                users={this.state.participants}
                {...currentUserAvatarProps}
                currentUser={
                    this.state.tokenRecived
                        ? {
                              email: this.context.username,
                              first_name: this.context.first_name,
                              last_name: this.context.last_name
                          }
                        : null
                }
            ></CurrentUsersAvatars>
        );
    }
}

CodxCollabWork.propTypes = {
    room: PropTypes.string.isRequired,
    user_email: PropTypes.string,
    user_first_name: PropTypes.string,
    user_second_name: PropTypes.string,
    state: PropTypes.any.isRequired,
    onParticipants: PropTypes.func,
    onStateChange: PropTypes.func,
    currentUserAvatarProps: PropTypes.object,
    hideCurrentUsersAvatars: PropTypes.bool,
    disabled: PropTypes.bool
};

const CodxCollabWorkHOC = (OriginalComponent) => {
    class NewComponent extends React.Component {
        render() {
            const state =
                typeof this.props.state === 'object'
                    ? JSON.parse(JSON.stringify(this.props.state))
                    : this.props.state;
            return <OriginalComponent {...this.props} state={state} key={this.props.room} />;
        }
    }
    return NewComponent;
};

export default CodxCollabWorkHOC(CodxCollabWork);
