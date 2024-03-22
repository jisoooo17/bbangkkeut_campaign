  //우편번호 기능 구현
  export const handlePostcode = (openPostcode, setOpenPostcode, setAddress) => ({
    clickButton: () => {
      setOpenPostcode((current) => !current);
    },
  
    selectAddress: (data) => {
      console.log(`
            주소: ${data.address},
            우편번호: ${data.zonecode}
        `);
      setAddress(data.address);
      setOpenPostcode(false);
    },
  });

  export default handlePostcode;