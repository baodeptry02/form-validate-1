/* options ở đây bằng với cái object của lệnh gọi hàm Validator ở bên file HTML */
function Validator (options) {

    /* thực tế ta ko biết từ thẻ input ra ngoài cái form-group có bao nhiêu cấp nên nếu ta fit cứng thì có nhiều hơn 1 cấp nó sẽ ko chạy được, chúng ta sẽ sử dụng vòng lặp, lặp dần ra tới khi chạm tới form-group là được */

    function getParent(element, selector) {

        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                /* kiểm tra xem element parent ở ngoài có chứa form-group hay ko, nếu ko thì lặp tiếp tới chừng nào thấy thì thôi */

                return element.parentElement
            }
            element = element.parentElement /* đầu tiên nhảy ra 1 cấp cha để tìm, nếu nó ko matches với form-group, thì ta gán cái biến element bằng chính cái thẻ cha của thẻ input luôn 
            <div>
                <div>
                <div>
                    <input>
                </div>
                </div>
                </div>
            ta có ví dụ sau, thì lúc đầu input nhảy ra 1 cấp là thẻ div cha thứ nhất, tìm ko thấy form-group thì sẽ gán cái thẻ div cha thứ nhất vào element, rồi vòng lặp sau, thẻ input thứ nhất nhảy ra 1 cấp nữa là thẻ input thứ 2 để tìm, cứ thế cho tới khi nào tìm được form-group thì nó sẽ return ra ngoài và kết thúc vòng lặp */
        }

    }


    var selectorRules = {} /* sau khi hàm options.rules.forEach chạy xong thì lưu tất cả các rule của tất cả selector vào trong object này */

    /* dùng hàm này để thực hiện việc hiện ra message lỗi hay không */
    function validate(inputElement, rule) {

        var errorMessage /* = rule.test(inputElement.value) */ /* sau khi có rules[i](inputElement.value) rồi thì ko cần thằng này nữa  */
         /* rule.test là function nên có lệnh gọi hàm và truyền cái value người dùng nhập vào trong này */
        // console.error(errorMessage)


        /* inputElement tương ứng với element còn selector là '.form-group' mà form-group là value của options.formGroupSelector ở bên file HTML nên đổi thành options.formGroupSelector */
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        /* cái này thay cho cái ở dưới vì cái dưới fix cứng */

        // var errorElement = inputElement.parentElement.querySelector(options.errorSelector) /* lấy value của errorSelector trong Object options ở bên file HTML */
         /*Lỗi ở đâu thì phải hiện ở đó, đang blur ở đâu, thì lấy ra cái thẻ cha của nó, rồi tìm thẻ con của nó ( là form-message)  */


        // Lấy ra các rules của selector 
         var rules = selectorRules[rule.selector] /* selectorRules là 1 object rỗng đã khai báo ở trên, trong đó là 1 mảng với value của key là rule.selector (#email, #password) */
         //selectorRules là 1 object trong đó có các Array , nên khi gọi selectorRules[rule.selector] tức là bạn get cái giá trị trong cái key [rule.selector]


         /* console.log(rules) */ /* sẽ thu được chính cái rule của thằng mà ta blur ra ngoài, có bao nhiêu rule thì nó sẽ hiển thị hết */


         // Lặp qua từng rule và kiểm tra
         // Nếu có lỗi thì dừng việc kiểm tra
         for (var i = 0; i < rules.length; i++) {
             switch (inputElement.type) {
                 /* check type của cái input, nếu là radio, checkbox thì phải xử lí như thế nào, còn default thì xử lí ban đầu */
                 case 'radio':
                case 'checkbox':

                    /* nó sẽ có 1 pseudo class là checked đằng sau 'input[name="gender"]:checked' nên ta sử dụng bài toán nối chuỗi ''input[name="gender"]' + ':checked' */
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked')) /* trong trường hợp này sẽ là input[name="gender"] */


                    break;
                    default:
                        errorMessage = rules[i](inputElement.value) /* rules[i] là hàm, chạy thì truyền value vào, y như rule.test(inputElement.value) ở trên nhưng vì rule.test chỉ xử lí được 1 rule duy nhất cho 1 input thôi, còn rules[i] xử lí bao nhiêu rules cho 1 input cũng được  */
             }

            
            if (errorMessage) break /* giả sử email có 2 làm là isRequired và isEmail, thì nó sẽ lặp qua isRequired và truyền đối số value từ inputElement.value vào, nếu chưa nhập gì, thì isRequired trả lại errorMessage và break luôn , còn nếu đã nhập rồi thì isRequired pass và nó sẽ chạy hàm isEmail để verify email */

         }

            /* nếu người dùng ko nhập gì thì in ra message lỗi, còn ko thì là chuỗi rỗng ( ko có gì cả )  */
            if (errorMessage) {
                errorElement.innerText = errorMessage
                getParent(inputElement, options.formGroupSelector).classList.add('invalid')
            } else {
                errorElement.innerText = ''
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
            }

            return !errorMessage /* Hàm validate trả ra true nếu có lỗi, còn false thì ko */
    }

    // Lấy element của form cần Validate
    /* console.log(options.form); */ /* sẽ nhận lại Selector của form, value là #form-1 */
    var formElement = document.querySelector(options.form) /* document.querySelector('#form-1'); */

        if (formElement) {

            /* console.log(options.rules); */
            
            // Khi submit form
            formElement.onsubmit = function(e) {
                e.preventDefault(); /* bỏ đi hành vị mặc định */

                var isFormValid = true

                /* Lặp qua từng rules và validate luôn */
                options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector); 
                var isValid = validate(inputElement, rule)
                    if (!isValid) {
                        /* nếu có 1 ông ko isValid thì sửa lại thằng isFormValid thành false */
                        isFormValid = false;
                    }
                })

                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])') /* khi lặp qua nó sẽ lấy kq cuối cùng, nên 3 thẻ input có name giống nhau là gender nó sẽ lấy kq là other vì nó nằm cuối cùng */

                if (isFormValid) {

                    // console.log('Không có lỗi') /* Khi bấm đăng kí (submit) nếu chưa điền gì thì nó sẽ báo có lỗi còn điền đúng hết và đầy đủ sẽ ko có lỗi */

                    // Trường hợp submit với js
                    if (typeof options.onSubmit === 'function') {

                        var enableInputs = formElement.querySelectorAll('[name]:not([disabled])') /* lấy  tất cả cái input có attribute là name và nó ko có attribute là disabled. */ 

                         /* console.log(enableInputs) */ /* Lấy ra là nodeList */

                        var formValues = Array.from(enableInputs).reduce(function(values, input) {
                            /* Hàm reduce này đang lặp qua enableInputs và lấy ra object cuối cùng là formValues và thả nó làm đối số qua function onSubmit, data bên HTML chính là formValues chúng ta nhận được qua cái enableInputs */
                            switch(input.type) {

                                /* input là cái ô nhập vào trong trường hợp này thì theo type, nếu type radio thì nó trả ra radio, còn checkbox thì nó trả ra checkbox, input.name là tên của input đó, ở trường hợp này là gender, [input.name] là để vào 1 cái mảng  */
                                case 'radio':
                                    if(!values[input.name]) {
                                        values[input.name] = '' /* nếu input ko tồn tại thì gán chuỗi rỗng */
                                    }
                                    if(input.matches(':checked')) {
                                        values[input.name] = input.value
                                    }
                                    break
                                    
                                    case 'checkbox':
                                    console.log(values)
                                    /* chỉ cần cái nào có checked thôi là nó sẽ push vào mảng hết, nghĩa là có thể chọn nhiều cái 1 lúc được */
                                    if(!values[input.name]) {
                                        values[input.name] = []  /* nếu input ko tồn tại thì gán mảng rỗng */
                                    }
                                    if(input.matches(':checked')) {
                                        values[input.name].push(input.value)
                                    }
                                    break

                                case 'file':
                                    values[input.name] = input.files /* lấy value của file ảnh */
                                    break

                                    default:
                                        values[input.name] /* lấy cái name đưa vào object values, values có initialValue là object rỗng */ 
                                        = input.value 
                                        /* làm như này thay vì toán tử && để tránh trường hợp có 1 ô input ko bắt buộc nhập ( ko có giá trị) thì lập tức kết quả của phép gán values[input.name] = input.value nó sẽ return chính cái giá trị của thằng input.value trong trường hợp này là 1 cái chuỗi rỗng, thì kết quả của phép gán này là 1 chuỗi rỗng, mà chuỗi rỗng là falsy nên kq trả về nó là chuỗi rỗng chứ ko lọt sang values nữa  */
                            }
                        return values /* luôn return ra object values */
                    }, {})

                    options.onSubmit(formValues)
                    }

                    // trường hợp submit với hành vi mặc định
                    else {
                        formElement.submit()
                    }

                } else {

                    // console.log('Có lỗi')

                }
            }

            /* Lặp qua mỗi rules và xử lí ( lắng nghe sự kiện blur, input, ...) */
            /* Do options.rules là 1 mảng nên dùng forEach để lặp qua lấy từng phần tử */
            options.rules.forEach(function(rule) {

                // Lưu lại các rules cho mỗi input
                if (Array.isArray( selectorRules[rule.selector])) {
                    /* phải đưa vào mảng nếu ko thì lúc lặp nó sẽ bị ghi đè */

                    /* nếu nó là cái mảng, và phần tử đó chạy qua đây 2 lần trở lên thì nó sẽ lọt vào đây */
                    selectorRules[rule.selector].push(rule.test)
                    
                } else {

                    /* nếu nó ko phải là cái mảng thì mình sẽ gán cho nó = 1 cái mảng có phần tử đầu tiên là 1 cái rule đầu tiên */
                    selectorRules[rule.selector] = [rule.test]

                }
                /* sau cái đoạn logic này sẽ lưu lại tất cả các rules */


                //  console.log(rule.selector)  /* rule.selector để lấy ra value của key selector ở dưới (#email, #password, ... )*/
                var inputElements = formElement.querySelectorAll(rule.selector); 
                /* phải đi từ formElement, tại vì lỡ như trong 1 trang quá nhiều form thì sẽ bị lỗi */

                Array.from(inputElements).forEach(function (inputElement) {
                    
                    // Xử lí trường hợp blur khỏi input
                    inputElement.onblur = function() {
                        
                        // console.log('blur' + rule.selector) /* blur khỏi element nào */
                        // console.log(inputElement.value) /* check xem người dùng đã nhập gì chưa */
    
                        // lấy được value người dùng nhập qua inputElement.value
                        // lấy được hàm để kiểm tra test function qua rule.test
                        // console.log(rule)
    
                        validate(inputElement, rule)
    
                    }
    
                    // xử lí mỗi khi người dùng nhập vào input phải hết báo lỗi
                    inputElement.oninput = function () {
                        // console.log(inputElement.value)
                        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                        errorElement.innerText = ''
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                    }

                })

            })
            // console.log(selectorRules)
        }
}

/* Gán 2 cái Validator.isRequired và Validator.isEmail 1 cái function */
// Định nghĩa các rules
// Nguyên tắc của các rules: 
// 1. Khi có lỗi => trả ra message lỗi
// 2. khi ko có lỗi => trả ra undefined

/* Rule của nhập Full name */
Validator.isRequired = function(selector, message) {

    /* return selector */ /* selector chính là cái ở trong cặp ngoặc, '#full-name' và '#email' của từng cái function */
    return {
        selector: selector,
        test: function(value) {
            if (selector.includes('#')) {
                return value.trim() /* không muốn người dùng nhập dấu cách */ ? undefined : message || 'Vui lòng nhập thông tin vào đây' /* khi có value thì trả undefined, còn ko có thì trả ra message */
            }
            return value ? undefined : message || 'Vui lòng nhập thông tin vào dây'
        }
    }
}

/* Rule của email */
Validator.isEmail = function(selector, message) {

    /* return selector */
    return {
        selector: selector,
        test: function (value) {

            /* js email regex */
            var regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';

        }
    }
}

/* Rule của password */
Validator.minLength = function(selector, min, message) { /* min = value 6 ở bên file HTMl */
    return {
    selector: selector,
        test: function(value) { 
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự` /* do có template string nên phải dùng cặp ngoặc `` này thay vì cặp ngoặc đơn */
        }
    }
}

/* Rule của password confirm */
Validator.isConfirmed = function(selector, getConfirmValue, message) { /* getConfirmValue sẽ bằng cái function ở bên HTML */
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác' /* nếu ko có message thì mới dụng câu mặc định */
        }
    }
}

/* Rule của phone number */
Validator.removeSpaces = function(selector, message) {
    return {
        selector: selector,
        test :function(value) {
            let isSpace = value.includes(" ");
            if (!isSpace && !isNaN(value)) {
                return value ? undefined : "value là  "
                }
        else {
            return "value sai"
        }
        }
    }
}