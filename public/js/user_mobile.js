
var page = 1;
var pageSize = 5;
//获取手机信息

function gitList() {
    $.get('/user_mobile/list', {
        page: page,
        pageSize: pageSize
    }, function (result) {
        console.log(result);
        if (result.code === 0) {
            var list = result.data.list;
            var totalPage = result.data.totalPage;
            var str = '';
            for (var i = 0; i < list.length; i++) {
                str +=
                    `
                         <tr>
                            <td>${i + 1}</td>
                            <td>${list[i].iphoneBrand}</td>
                            <td><img src='/iphoneImg/${list[i].fileName}'></td>
                            <td>${list[i].iphoneName}</td>
                            <td>${list[i].priceG}</td>
                            <td>${list[i].priceE}</td>
                            <td class="td"><a href="#" class="updata">修改</a><a href="#">删除</a></td>
                        </tr>
                `
            }
            var pageStr = '';
            for (var i = 0; i < totalPage; i++) {
                pageStr += `
                  <li data_id='${i + 1}'>${i + 1}</li>
                `
            }
            console.log(str);
            // console.log(11111111111111111111111)
            $('tbody').html(str);
            $('#uli').html(pageStr);

        }
    })
}
$(function () {
    gitList();
    $('#btn').click(function () {
        $('.addIphone').show();
        $('.updataIphone').hide();
    })
    $('.cancle').click(function () {
        $('.addIphone').hide();
    })
    $('.add').click(function () {
        $('.updataIphone').hide();
        var formData = new FormData();
        formData.append('iphoneBrand', $('#iphoneBrand option:selected').text());
        formData.append('iphoneName', $('#iphoneName').val());
        formData.append('priceG', $('#priceG').val());
        formData.append('priceE', $('#priceE').val());
        formData.append('iphoneImg', $('#iphoneImg')[0].files[0]);
        $.ajax({
            url: '/user_mobile/add',
            method: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.code === 0) {
                    $('.addIphone').hide();
                    gitList();
                }
                else {
                    alert(result.msg);
                }
            },
            error: function () {
            }
        })
    })
    $('.updata').click(function () {
        $('.updataIphone').show();
        $('.addIphone').hide();

    })
    $('.updataok').click(function () {
        $('.updataIphone').hide();
    })
    $('.cancleok').click(function () {
        $('.updataIphone').hide();
    })
    // $('#uli').find('li').eq(0).addClass('active')
    $('#uli').on('click', 'li', function () {
        console.log(1)
        page = $(this).attr('data_id');
        gitList();
        // $(this).addClass('active');
    })
})