import React from "react";
import { Component } from "react";
import { Button, Icon } from "@mui/material";
import { Close } from "@mui/icons-material";
import Card from "@mui/material/Card";
import { TextareaAutosize } from "@mui/material";
import axios from "axios";
import { connect } from "react-redux";

class ActionButton extends Component {

    constructor(props) {
        super(props);
        this.state = { formOpen: false, input: '' };
        this.formRef = React.createRef();
        this.passClick = true;
    }

    openForm = async () => {
        await this.setState({ formOpen: true });

        const a = document.getElementById(`cardsContainer_${this.props.listId}`)
        if (a && a.scrollHeight > a.offsetHeight)
            a.scrollTo(null, a.scrollHeight);

        const e = document.getElementById("addFormTextArea")
        e.select()


        document.addEventListener('click', this.handleClickOutside, false);
    }

    closeForm = () => {
        document.removeEventListener('click', this.handleClickOutside, false);
        this.setState({ formOpen: false, error: false });
        this.passClick = true
    }

    handleClickOutside = (e) => {
        if (this.passClick) {
            this.passClick = false
            return
        }

        const myRef = this.formRef.current;
        if (!(myRef.contains(e.target))) {
            this.closeForm()
        }
    }

    renderAddButton = () => {
        const { projectUser } = this.props;
        const { projectButton } = this.props;
        const { list } = this.props;
        const buttonText = projectUser ? "Add participant" : projectButton ? "Add project" : list ? "Add list" : "Add card";
        return (
            <div
                className={(projectUser || projectButton) ? "projectOpenFormButton" : list ? "listOpenFormButton" : "cardOpenFormButton"}
                onClick={this.openForm}
            >
                <Icon>+</Icon>
                <p style={{ font: "caption" }}>{buttonText}</p>
            </div>
        );
    }

    handleKeyPress = (e) => {
        if (e.key === "Enter")
            this.handleSubmit()
    }

    handleInputChange = (e) => {
        const input = e.target.value;
        const max_len = 255
        if (input.indexOf('\n') < 0 && input.length < max_len)
            this.setState({ input: input, error: false })
    }

    handleSubmit = async () => {
        const input = this.state.input.trim()
        if (typeof input != "string" || input === '')
            return


        const { projectButton } = this.props;
        const { list } = this.props;
        const { index } = this.props
        const { listId } = this.props
        const { userId } = this.props;
        const { projectId } = this.props;
        const { title } = this.props;
        const { users } = this.props;
        const { projectUser } = this.props;
        const { user } = this.props;

        const newUser = projectUser ? await axios
            .get(`http://209.126.0.235:8000/api/user_search?input=${input}`)
            .then((response) => {
                return response.data;
            })
            .then((data) => {
                return data[0]
            }) : undefined

        console.log(userId);
        console.log(user);

        const url = projectUser ? `http://209.126.0.235:8000/api/projects/${projectId}/` : projectButton ? "http://209.126.0.235:8000/api/projects/" : list ? "http://209.126.0.235:8000/api/lists/" : "http://209.126.0.235:8000/api/cards/"
        const data = projectButton ? {
            users: [userId],
            title: input,
        } : list ?
            {
                projectId: projectId,
                index: index,
                title: input,
            } : {
                listId: listId,
                index: index,
                text: input
            }

        if (projectUser) {
            console.log(newUser);
            console.log(data);

            if (newUser) {
                const usersId = [...users].map(({ id }) => id)
                if (usersId.includes(newUser.id)) {
                    this.setState({ error: true, errorMassage: 'User already added' })
                }
                else {
                    axios.put(url, {
                        id: projectId,
                        users: [...usersId, newUser.id],
                        title: title,
                    })
                        .then(res => {
                            console.log(res.data);
                            this.props.updateProjectUsers({ projectId: projectId, users: [...users, newUser] })
                            this.closeForm()
                            this.setState({ input: undefined, error: false })
                        })
                        .catch(err => console.log(err))
                }
            }
            else {
                this.setState({ error: true, errorMassage: 'User not found' })
            }


        } else {
            console.log(data)
            axios.post(url, data)
                .then(res => {
                    console.log(res.data);
                    projectButton ? this.props.addProjects({
                        project: {
                            id: res.data.id,
                            title: res.data.title,
                            users: [user],
                            lists: []
                        }
                    }) :
                        list ? this.props.addList({ projectId: projectId, list: res.data }) :
                            this.props.addCard({ projectId: projectId, listId: listId, card: res.data })
                    this.closeForm()
                    this.setState({ input: undefined })
                })
                .catch(err => console.log(err))
        }
    }

    renderForm = () => {
        const { projectButton } = this.props;
        const { list } = this.props;
        const { projectUser } = this.props;
        const { error } = this.state;
        const { errorMassage } = this.state;
        const placeHolder = projectUser ? "Enter username or email..." : projectButton ? "Enter project name..." : list ? "Enter list name..." : "Enter card description...";
        const buttonTitle = projectUser ? "Add user" : projectButton ? "Add project" : list ? "Add list" : "Add card";

        return (
            <div className={projectUser ? "projectContainer" : projectButton ? "projectContainer" : list ? "listContainer" : null} ref={this.formRef}>
                <div id="actionButtonContainer">
                    <Card
                        sx={projectUser || projectButton || list ? {
                            border: 1,
                            borderColor: error ? 'red' : "#3498DB",
                            borderWidth: 2.6,
                            boxShadow: 0,
                        } : {}}
                        style={{
                            minHeight: list || projectUser ? 30 : 80,
                            padding: '6px 8px 2px',
                        }}>
                        <TextareaAutosize
                            className="textArea"
                            placeholder={placeHolder}
                            autoFocus={true}
                            value={this.state.input}
                            onChange={this.handleInputChange}
                            onKeyPress={(e) => {
                                return this.handleKeyPress(e)
                            }}
                            id="addFormTextArea"
                            style={projectButton || list ? {
                                fontSize: "1.17em",
                                fontWeight: "bolder"
                            } : { padding: 10, width: "92%" }}
                        />
                    </Card>
                    {error ? <div style={{ color: 'red' }}>
                        {errorMassage}
                    </div> : null}
                    <div className="formButtonGroup">
                        <Button
                            variant="contained"
                            style={{
                                color: "white",
                                backgroundColor: "#3498DB",
                            }}
                            onClick={this.handleSubmit}
                        >
                            {buttonTitle}
                        </Button>
                        <Close
                            style={{ marginLeft: 8, cursor: "pointer", }}
                            onClick={() => {
                                this.closeForm();
                                this.setState({ input: undefined });
                            }} />
                    </div>
                </div>
            </div>);
    }
    render = () => {
        return this.state.formOpen ? this.renderForm() : this.renderAddButton();
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        addProjects: (payload) => dispatch({ type: 'ADD_PROJECT', payload: payload }),
        addList: (payload) => dispatch({ type: 'ADD_LIST', payload: payload }),
        addCard: (payload) => dispatch({ type: 'ADD_CARD', payload: payload }),
        updateProjectUsers: (payload) => dispatch({ type: 'UPDATE_USERS', payload: payload }),
    }
}

export default connect(null, mapDispatchToProps)(ActionButton);