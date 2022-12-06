import React, {ChangeEvent, useEffect, useRef, useState} from 'react';

import {TextField} from '@mui/material';

import {Button} from '@material-ui/core';

import {MessageType, StatusType} from '../../store/reducers/messagesReducer';

import style from './Dialogs.module.scss';

type DialogsPropsType = {
    dialogs: MessageType[],
    pushMessage: (message: string) => void,
    myId: number,
    isReady: StatusType,
}

const Dialogs: React.FC<DialogsPropsType> = ({dialogs, pushMessage, myId, isReady}) => {
    console.log('>>>>>>DIALOGS');

    const [message, setMessage] = useState('');
    const messagesAnchorRef = useRef<HTMLDivElement>(null);
    const [isAutoScroll, setAutoScroll] = useState(false);

    const scrollHandler = (e: React.UIEvent<HTMLInputElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 10) {
            isAutoScroll && setAutoScroll(false);
        } else {
            !isAutoScroll && setAutoScroll(true);
        }
    };

    const messages = <div className={style.messages} id="messages" onScroll={scrollHandler}>
        {dialogs.map((m, index) =>
            <div key={index} className={`${m.userId === myId ? `${style.myMessage}` : `${style.message}`}`}>
                <p><span><img src={m.photo} alt="" style={{width: 25, height: 25, borderRadius: '50%'}}/>
                    {m.userName}</span> {m.message}</p>
            </div>)}
        <div ref={messagesAnchorRef}></div>
    </div>;

    useEffect(() => {
        if (!isAutoScroll) {
            // messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'});
            messagesAnchorRef.current?.scrollIntoView(true);
        }
    }, [dialogs]);

    const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setMessage(e.currentTarget.value);
    };

    const onClickHandler = () => {
        pushMessage(message);
        setMessage('');
    };

    return (
        <div className={style.dialogBlock}>
            {messages}
            <TextField label="Message"
                       variant="filled" value={message}
                       onChange={onChangeHandler}
                       multiline={true}
                       autoFocus
            />
            <Button disabled={isReady !== 'ready'} variant={'contained'} onClick={onClickHandler} color={'primary'}>Send Message</Button>
        </div>
    );
};

export default Dialogs;