/* eslint-disable no-restricted-globals */

const onClickLink = (event: any, sti: string) => {
    // @ts-ignore
    history.push(sti);
    event.preventDefault();
};

const onClickBackLink = (event: any) => {
    // @ts-ignore
    history.back();
    event.preventDefault();
};

export { onClickLink, onClickBackLink }
