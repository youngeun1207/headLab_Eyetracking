export let userID = {
    division: null,
    id: null
};
export let personalInfo = {
    age: null,
    gender: null,
    year: null,
    hour: null,
    major: null
};

// export let userID = {
//     division: null,
//     class: null,
//     id: null
// };

// export let personalInfo = {
//     age: null,
//     gender: null,
//     disability_type: "NA"
// };

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
            max: 50,
            step: 1
        },
        inputValue: 20,
    })
        
    if (age) {
        personalInfo.age = Number(age);
     }
}

export async function inputExperience(){
    const { value: year } = await swal.fire({
        title: '본인이 경험한 미술 학습 경험은 몇 년인가요?',
        input: 'range',
        inputAttributes: {
            min: 0,
            max: 30,
            step: 1
        },
        inputValue: 15,
    })
        
    if (year) {
        personalInfo.year = Number(year);
     }
}

export async function inputArtworkHour(){
    const { value: hour } = await swal.fire({
        title: '주당 미술 활동 시간은 몇 시간인가요??',
        input: 'range',
        inputAttributes: {
            min: 0,
            max: 30,
            step: 1
        },
        inputValue: 15,
    })
        
    if (hour) {
        personalInfo.hour = Number(hour);
     }
}

async function inputMajor() {
    const { value: major } = await swal.fire({
        title: '미술 전공자시라면<br>본인의 세부 전공을 선택해주세요',
        input: 'select',
        inputOptions: {
            fineArt: '순수미술(서양화, 동양화, 조소 등)',
            design: '디자인(시각, 산업, 패션 등)',
            crafts: '공예(금속, 도자, 섬유 등)',
            education: '미술교육',
            history: '미술사',
            aesthetics: '미학',
            etc: '기타',
            no: '해당 없음'
        },
        inputPlaceholder: '전공 선택',
        showCancelButton: false,
        allowOutsideClick: false,
        inputValidator: (major) => {
            return new Promise((resolve) => {
                if (major != '') {
                    resolve()
                } else {
                    resolve('전공 선택은 필수입니다.')
                }
            })
        }
    }).then()

    if (major) {
        personalInfo.major = major;
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
            fineArt: '전공실기: 회화',
            media: '전공실기: 미디어',
            design: '전공실기: 일러스트 및 디자인',
            composite: '전공실기: 복합매체',
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

async function showNotifications() {
    const steps = ['1', '2', '3', '4']
    const Queue = Swal.mixin({
        progressSteps: steps,
        title: "NOTICE",
        confirmButtonText: '다음',
        // optional classes to avoid backdrop blinking between steps
        showClass: { backdrop: 'swal2-noanimation' },
        hideClass: { backdrop: 'swal2-noanimation' }
    })

    await Queue.fire({
        html: `본 연구는 디지털 드로잉 중 사용자의 시선 이동을 분석하는 데 <br>목적을 두고 있습니다.`,
        currentProgressStep: 0,
        showClass: { backdrop: 'swal2-noanimation' },
    })
    await Queue.fire({
        html: '주어진 시간 10분을 최대한 채워서 그려주세요.',
        currentProgressStep: 1
    })
    await Queue.fire({
        html: '카메라를 손으로 가리지 않도록 주의해주세요.',
        currentProgressStep: 2
    })
    await Queue.fire({
        html: '되도록이면 지금 자세를 유지해주세요.',
        currentProgressStep: 3,
        confirmButtonText: 'OK',
        showClass: { backdrop: 'swal2-noanimation' },
    })
}


export async function inputUserInfo() {
    await showNotifications();
    await inputAge();
    await inputGender();
    await inputExperience();
    await inputArtworkHour();
    await inputMajor();
    // await inputDivision();
    // 1월 테스트
    userID.division = 'JAN';
    // await inputClass();
    await inputID();
}