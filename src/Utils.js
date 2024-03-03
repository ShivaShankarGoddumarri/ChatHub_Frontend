

export const socket_io = process.env.REACT_APP_SOCKET_IO



export const convertToDate = (inputDate) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const date = inputDate?.split('-')[1][0] == '0' ? inputDate?.split('-')[1][1] - 1 : inputDate?.split('-')[1] - 1
    return `${months[date]} ${inputDate?.split('-')[0]}`

}


// gives in format 2024-jan-08
export const formatedDate = (inputDate) => {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const date = inputDate?.split('-')[1][0] == '0' ? inputDate?.split('-')[1][1] - 1 : inputDate?.split('-')[1] - 1
    return `${inputDate?.split('-')[2].slice(0, 2)} ${months[date]} ${inputDate?.split('-')[0]}`

}















