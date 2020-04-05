import React from "react";
import ChatBot from "react-simple-chatbot";
import moment from "moment";
import {ThemeProvider} from 'styled-components';


function checkDateValidity(value) {
    const dateEntered = value;
    if (moment(dateEntered, "DD.MM.YYYY", true).isValid() && (moment(dateEntered, "DD.MM.YYYY", true) < moment.now())) {
        return true
    } else {
        return false
    }
}

function calculateAge(birthday) { // birthday is a date

    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
        console.log(age);
        return age;
    }
}

// function Greeting(state) {
//     const chatEnded = this.state.chatEnded;
//     if (chatEnded) {
//         return <div>conversation terminée</div>
//     }
//     return <div>conversation non terminado</div>
// }

export default class BnpChatbot extends React.Component {

    constructor(props) {
        super(props);
        this.handleEnd = this.handleEnd.bind(this);
        this.state = {chatEnded: false};
    }


    handleEnd({steps, values}) {
        this.state.gender = `${values[0]}`;
        this.state.name = `${values[1]}`;
        this.state.birth = `${values[2]}`;
        console.log(this.state.name);
        console.log(this.state.gender);
        console.log(this.state.birth);
        let entry = {
            id: 'Done',
            message: 'il se passe un truc ?',
            trigger: 'recap'
        };
        steps.push(entry);
        console.log(steps)
    }


    render() {

        const config = {
            width: "300px",
            height: "400px",
            floating: true
        };

        const image = {url: "https://static-s.aa-cdn.net/img/gp/20600007729968/FTzKM268-gY1wMf2z9071oktm-jTLAHh-_wTKmyev1eMEQnGQZPQgDec_KyvKjJGwF9H=w300"};

        const theme = {
            background: '#f5f8fb',
            fontFamily: 'arial',
            headerBgColor: '#6c757d',
            headerFontColor: '#fff',
            headerFontSize: '15px',
            botBubbleColor: '#6c757d',
            botFontColor: '#fff',
            userBubbleColor: '#10912c',
            userFontColor: '#fff',
        };


        const steps = [
                {
                    id: "Greet",
                    message: "Hello, Welcome to our BNP Chatbot",
                    trigger: "Ask Gender"
                },
                {
                    id: "Ask Gender",
                    message: "Êtes-vous un homme ou une femme ?",
                    trigger: "gender"
                },
                {
                    id: "gender",
                    options: [
                        {value: "Homme", label: "Homme", trigger: "Ask Name"},
                        {value: "Femme", label: "Femme", trigger: "Ask Name"}
                    ]
                },
                {
                    id: "Ask Name",
                    message: "Merci, quel est votre prénom",
                    trigger: "name"
                },
                {
                    id: "name",
                    user: true,

                    validator: (value) => {
                        if (!value) {
                            return 'veuillez saisir votre prénom';
                        }
                        return true;
                    },
                    trigger: "Personalize Greetings"
                },
                {
                    id: "Personalize Greetings",
                    message: "Enchanté {previousValue}, Joli prénom",
                    trigger: "Asking for birthdate"
                },
                {
                    id: "Asking for birthdate",
                    message: "Quelle est votre date de naissance ?",
                    trigger: "Waiting for birthdate input"
                },

                {
                    id: "Waiting for birthdate input",
                    placeholder: "format dd.mm.yyyy souhaité",
                    user: true,

                    validator: (value) => {

                        if (checkDateValidity(value)) {
                            this.state.age = calculateAge(value);
                            if (this.state.age >= 18) {
                                this.state.majeur = true;
                                console.log('is it majeur : ' + this.state.majeur)
                            } else {
                                this.state.majeur = false;
                                console.log('is it majeur : ' + this.state.majeur)
                            }
                            return true;
                        }
                        return 'invalid date';
                    },

                    trigger: 'recap',
                },

                {
                    id: 'recap',
                    message: "Merci {state.gender} {state.name}, vous êtes ({this.state.majeur} ? \"majeur\":\"mineur\")} ",
                    trigger: 'Done'

                },

                {
                    id: 'Done',
                    message: 'Ciao',
                    end: true,
                },

            ]
        ;


        return <div>
            <ThemeProvider theme={theme}>
                <ChatBot steps={steps} {...config} handleEnd={this.handleEnd} botAvatar={image.url}/>
            </ThemeProvider>
        </div>

    }
}
