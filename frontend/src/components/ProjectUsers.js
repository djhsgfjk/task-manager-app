import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import {Close} from "@mui/icons-material";
import {Card, CardContent, List, ListItem, IconButton, ListItemText, Typography} from "@mui/material";
import axios from "axios";
import {connect} from "react-redux";


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
        this.setState({opened: false});
        document.removeEventListener('click', this.handleClickOutside);
    }

    deleteUser = (e, userId) => {
        console.log(e.target.closest('.user-list-item'))

        const {projectId} = this.props;
        const {users} = this.props;
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
                this.props.updateProject(data)
                // console.log(e.target.closest('.user-list-item'))
                e.target.closest('.user-list-item').remove();
            })
            .catch(err => console.log(err))
    }


    render() {
        const {users} = this.props;
        const {opened} = this.state;
        const title = 'Участники проекта'
        const {userId} = this.props;

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
                                paddingTop: '8px',
                                paddingButton: '8px',
                            }}>
                                <h3 style={{margin: 0}}>{title}</h3>
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

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProject: (payload) => dispatch({type: 'UPDATE_PROJECT', payload: payload}),
    }
}

export default connect(null, mapDispatchToProps)(ProjectUsers);