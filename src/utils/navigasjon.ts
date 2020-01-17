/* eslint-disable no-restricted-globals */

const onClickLink = (event: any, sti: string) => {
    // @ts-ignore
    history.push(sti);
    event.preventDefault();
};

export { onClickLink }
