import { utils, write } from 'xlsx';

const generateExcelSheet = (applications, companyName, date) => {
  const ws = utils.json_to_sheet(applications);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, `${companyName}_${date}`);

  const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer;
};

export default generateExcelSheet;
