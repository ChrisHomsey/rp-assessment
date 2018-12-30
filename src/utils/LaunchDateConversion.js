export default function LaunchDateConversion(unixDate) {
    // Turn the unix date provided into a proper unix date for javascript
    const epochDate = Number(unixDate) * 1000;

    // create a new javascript Date object
    const date = new Date(epochDate);

    // Format the date into M/d/yyyy format. Note: getMonth() returns 0-indexed value while getDate() returns 1-indexed value
    const formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
    return formattedDate;
}