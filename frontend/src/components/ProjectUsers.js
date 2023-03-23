import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import {Close} from "@mui/icons-material";
import {
    Card,
    CardContent,
    List,
    ListItem,
    IconButton,
    ListItemText,
    Typography,
    Icon,
    TextareaAutosize, Button
} from "@mui/material";
import axios from "axios";
import {connect} from "react-redux";
import ActionButton from "./ActionButton";


class ProjectUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opened: false};
    }

    handleClickOutside = (e) => {
        const modalContent = document.querySelector('.modal-opened .modal__content');
        const btn = document.querySelector('.users-modal-btn');
        if (modalContent && !(modalContent.contains(e.target)) && !(btn.contains(e.target))) {
            this.closeModal();
        }
    };

    openModal = () => {
        this.setState({opened: true});
        document.addEventListener('click', this.handleClickOutside);

    }

    closeModal = (index) => {
        this.setState({opened: false, addUserFromOpened: false});
        document.removeEventListener('click', this.handleClickOutside);
    }

    deleteUser = (e, userId) => {
        console.log(e.target.closest('.user-list-item'))

        const {projectId} = this.props;
        const users = this.props.projects.find((project) => (project.id === projectId)).users;
        const {title} = this.props;

        const url = `http://localhost:8000/api/projects/${projectId}/`
        const data =
            {
                id: projectId,
                users: users.map(({id}) => id).filter((id) => id !== userId),
                title: title,
            }
        console.log(data)

        axios.put(url, data)
            .then(res => {
                console.log(res.data);
                this.props.updateProjectUsers({projectId: projectId, users: users.filter(({id}) => id !== userId)})
                // e.target.closest('.user-list-item').remove();
            })
            .catch(err => console.log(err))
    }

    render() {
        const {projectId} = this.props;
        const users = this.props.projects.find((project) => (project.id === projectId)).users;
        console.log(users)
        const {opened} = this.state;
        const modalTitle = 'Участники проекта'
        const {userId} = this.props;
        const {title} = this.props;


        return <div>
            <IconButton className={'users-modal-btn'} aria-label="users" onClick={this.openModal}>
                <GroupIcon/>
            </IconButton>

            <div className={opened ? 'modal modal-opened' : 'modal'}>
                <div className={'modal__content'}>
                    <Card sx={{
                        overflow: 'auto',
                        borderRadius: "6px",
                        boxShadow: "rgba(0, 0, 0, 0.35) 0 5px 15px",
                        padding: '8px',
                    }}>
                        <CardContent sx={{display: 'flex',
                            justifyContent: 'flex-end',
                            flexDirection: 'column',
                            alignItems: 'flex-end'}}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                                <h3 style={{margin: 0}}>{modalTitle}</h3>
                                <Close
                                    style={{marginLeft: "8px", cursor: "pointer",}}
                                    onClick={this.closeModal}/>
                            </div>
                            <List sx={{
                                width: 360, bgcolor: 'background.paper',
                                position: 'relative',
                            }}>
                                {users.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        disableGutters
                                        secondaryAction={
                                            user.id !== userId ?
                                                <IconButton aria-label="user" onClick={(e) => {this.deleteUser(e, user.id)}}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                                : null
                                        }
                                        className={'user-list-item'}
                                    >
                                        <ListItemText
                                            primary={user.username}
                                            secondary={
                                                <React.Fragment>
                                                    {user.email}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <ActionButton projectUser users={users} title={title} projectId={projectId}  />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = state => {
    return {projects: state.projects}
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProjectUsers: (payload) => dispatch({type: 'UPDATE_USERS', payload: payload}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUsers);