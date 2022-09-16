export var userID = {
    division: null,
    class: null,
    id: null
};

export var personalInfo = {
    age: null,
    gender: null,
    disability_type: "NA"
};

export async function inputDivision() {
    const { value: division } = await swal.fire({
        title: '소속을 선택해주세요',
        input: 'select',
        inputOptions: {
            test: 'Test',
            disability: '장애',
            genius: '영재'
        },
        inputPlaceholder: '소속 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value != '') {
                    resolve()
                } else {
                    resolve('소속 선택은 필수입니다.')
                }
            })
        }
    }).then()

    if(division){
        userID.division = division;
        if(division == "disability"){
            await inputDisabilityType();
        }
    }
}

async function inputDisabilityType(){
    const { value: type } = await swal.fire({
        title: '장애 유형을 선택해주세요',
        input: 'select',
        inputOptions: {
            autism: '자폐',
            intellectual: '지적',
            complex: '복합',
            etc: '기타'
        },
        inputPlaceholder: '장애 유형을 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value != '') {
                    resolve()
                } else {
                    resolve('장애 유형 선택은 필수입니다.')
                }
            })
        }
    }).then()

    if(type){
        personalInfo.disability_type = type;
    }
}

export async function inputGender(){
    const { value: gender } = await swal.fire({
        title: '성별을 선택해주세요',
        input: 'radio',
        inputOptions: {
            M: "남성",
            F: "여성"
        },
        inputValidator: (value) => {
          if (!value) {
            return '성별 선택은 필수입니다.'
          }
        }
      })
      if (gender) {
        personalInfo.gender = gender;
      }
}

export async function inputAge(){
    const { value: age } = await swal.fire({
        title: '연령을 선택해주세요',
        input: 'range',
        inputAttributes: {
            min: 8,
            max: 30,
            step: 1
        },
        inputValue: 15,
    })
        
    if (age) {
        personalInfo.age = Number(age);
     }
}

export async function inputClass() {
    const { value: color } = await swal.fire({
        title: '반을 선택해주세요',
        input: 'select',
        inputOptions: {
            red: '빨강',
            orange: '주황',
            yellow: '노랑',
            yellowGreen: '연두',
            green: '초록',
            blue: '파랑',
            sky: '하늘',
            pink: '분홍',
            purple: '보라',
            white: '하양',
            test: 'tester'
        },
        inputPlaceholder: '반 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value != '') {
                    resolve()
                } else {
                    resolve('반 선택은 필수입니다.')
                }
            })
        }
    }).then()
        
    if (color) {
        userID.class = color;
     }
}

export async function inputID() {
    await swal.fire({
        title: '이름을 입력해주세요',
        focusConfirm: false,
        html: `<input type="text" id="login" class="swal2-input" placeholder="이름 입력">`,
        allowOutsideClick: false,
        preConfirm: () => {
            const login = swal.getPopup().querySelector('#login').value
            if (!login) {
              Swal.showValidationMessage(`이름 입력은 필수입니다.`)
            }
            return { login: login }
        }
    }).then((result) => {
        userID.id = result.value.login;
        $("body *").css({
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        });
    })
}

export async function inputUserInfo() {
    await inputAge();
    await inputGender();
    await inputDivision();
    await inputClass();
    await inputID();
}