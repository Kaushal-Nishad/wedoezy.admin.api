import { GetQueryDto } from '../dto/getQueryDto';
import { Workbook } from 'exceljs';
import * as tmp from 'tmp';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export const toPromise = <T>(data: T): Promise<T> => {
    return new Promise<T>((resolve) => {
        resolve(data);
    });
};

export const getSortParam = (query: GetQueryDto) => {
    var sortObject = {};
    if (query.type !== undefined) {
        sortObject = { [query.type]: query.softingorder === 'true' ? 1 : -1 };
    } else {
        sortObject = { createdAt: -1 };
    }
    return sortObject;
};

export const getCurrentDatetime = (): Date => {
    return new Date();
};

export const exportToExcel = async (data = []) => {
    let row = [];
    data.forEach((e) => {
        row.push(Object.values(e));
    });
    let book = new Workbook();
    let sheet = book.addWorksheet('sheet1');
    row.unshift(Object.keys(data[0]));
    sheet.addRows(row);
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', bgColor: { argb: 'dddddd' }, fgColor: { argb: 'dddddd' } };
    sheet.getRow(1).border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
    };

    let File = await new Promise((resolve, reject) => {
        tmp.file({ discardDescriptor: true, prefix: `MyExcelSheet`, postfix: '.xlsx', mode: parseInt('0600', 8) }, async (err, file) => {
            if (err) throw new BadRequestException(err);

            book.xlsx
                .writeFile(file)
                .then((_) => {
                    resolve(file);
                })
                .catch((err) => {
                    throw new BadRequestException(err);
                });
        });
    });
    return File;
};
export const validurlcreater = (url) => {
    let newURl = url.replace(/[^\w\s]/gi, '-');
    return newURl.replace(' ', '');
};

export const addSeconds = (date): Date => {
    var result = new Date(date);
    result.setSeconds(result.getSeconds() + 86399);
    return result;
};

export const addDays = (date, days): Date => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const addMonths = (date, month): Date => {
    var result = new Date(date);
    result.setMonth(result.getMonth() + month);
    return result;
};

export const addYears = (date, year): Date => {
    var result = new Date(date);
    result.setFullYear(result.getFullYear() + year);
    return result;
};

export const getDifferenceInDays = (date1, date2): number => {
    if (!date2) {
        return 0;
    }
    const diffInMs = date2 - date1;
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};


export const logTotext = (message, path) => {
    let responsemessage = {
        timestamp: new Date().toISOString(),
        path: path,
    };

    //console.log(response);
    let ErrorText = `**********${responsemessage.timestamp}**********` + '\n';
    ErrorText += `Path = ${responsemessage.path}` + '\n';
    ErrorText += message + '\n';
    const fs = require('fs');
    const filePath = `./Log`;
    //const fileName = `Error.txt`;
    const dir = `${filePath}`;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var fileName = 'Log_' + mm + '' + dd + '' + yyyy + '.txt';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true,
        });
    }
    if (!fs.existsSync(`${filePath}/${fileName}`)) {
        fs.writeFile(`${filePath}/${fileName}`, ErrorText, function (err) {
            if (err) throw new ForbiddenException(err);
            console.log('Saved!');
        });
    } else {
        fs.appendFile(`${filePath}/${fileName}`, ErrorText, function (err) {
            if (err) throw new ForbiddenException(err);
            console.log('Saved!');
        });
    }
};

export const DateFormat = (dateobj) => {
    if (dateobj !== undefined) {
        
        const ddate = new Date(dateobj);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const day = ddate.getDate();

        const monthIndex = ddate.getMonth();
        const monthName = monthNames[monthIndex];

        const year = ddate.getFullYear();

        return `${day}-${monthName}-${year}`;
    }
    return '';
};
