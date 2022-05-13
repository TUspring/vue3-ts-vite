<template>
  <div class="container module-wrap">
    <!-- 1、单行输入框 -->
    <div v-if="item.key ==='single_input'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2" v-html="item.value"></div>
        <div v-else class="selected-info">
          <input class="input-box" type="text" :placeholder="item.data.tips" v-model="item.value" />
        </div>
      </div>
      <div v-if="item.name === '表格号' && applyAdjust">
        <span>{{applyAdjust.name}}：</span>
        <span style="color: red;">{{applyAdjust.value}}</span>
      </div>
    </div>

    <!-- 2、多行输入框 -->
    <div v-if="item.key ==='multiple_input'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2" v-html="item.value"></div>
        <div v-else>
          <textarea class="input-textarea-box" rows="3" :placeholder="item.data.tips" v-model="item.value"></textarea>
        </div>
      </div>
    </div>

    <!-- 3、数字输入框 -->
    <div v-if="item.key ==='number_input'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2" v-html="item.value"></div>
        <div v-else class="selected-info">
          <input class="input-box" type="number" :placeholder="item.data.tips" v-model="item.value" />
        </div>
      </div>
    </div>

    <!-- 4、单选框 -->
    <div v-if="item.key ==='radio_choice'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2" v-html="item.value"></div>
        <div v-else class="edit-view" @click="showSelectPopup(item,'radio')">
          <div v-if="!item.value" class="selected-info">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.value}}</span>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 5、多选框 -->
    <div v-if="item.key ==='multiple_choice'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2">
          <span v-if="item.value">{{item.value.join('，')}}</span>
        </div>
        <div v-else class="edit-view" @click="showSelectPopup(item,'check')">
          <div v-if="!item.value" class="selected-info">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <div>
              <p v-for="(item, index) in item.value" :key="index">{{item}}</p>
            </div>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 6、日期 -->
    <div v-if="item.key ==='date'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2" v-html="item.value"></div>
        <div v-else class="edit-view" @click="showDateSelect(item)">
          <div v-if="!item.value" class="selected-info">
            <span class="item-view-tips">请选择</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.value}}</span>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 7、日期区间 -->
    <div v-if="item.key ==='date_rang'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']" v-if="item.permission != 1">
        {{item.data.start_date_title}}-{{item.data.end_date_title}}</div>
      <div>
        <div v-if="item.permission == 2">
          <span v-if="item.value">{{item.value.join('，')}}</span>
        </div>
        <div v-else>
          <!-- 开始日期 -->
          <div class="thin-line">
            <div class="tit-label editable">{{item.data.start_date_title}}</div>
            <div class="edit-view" @click="showDateSelect(item, 'start_value')">
              <div v-if="!item.data.start_value" class="selected-info">
                <span class="item-view-tips">请选择</span>
                <i class="iconfont icon-arrow-left icon-arrow"></i>
              </div>
              <div v-else class="selected-info">
                <span>{{item.data.start_value}}</span>
                <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeDateValue(item, 'start_value')"></i>
              </div>
            </div>
          </div>
          <!-- 结束日期 -->
          <div style="padding-top: 5px;">
            <div class="tit-label editable">{{item.data.end_date_title}}</div>
            <div class="edit-view" @click="showDateSelect(item, 'end_value')">
              <div v-if="!item.data.end_value" class="selected-info">
                <span class="item-view-tips">请选择</span>
                <i class="iconfont icon-arrow-left icon-arrow"></i>
              </div>
              <div v-else class="selected-info">
                <span>{{item.data.end_value}}</span>
                <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeDateValue(item, 'end_value')"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 8、图片 -->
    <div v-if="item.key ==='picture'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label', 'df-bt']">
        <span>{{item.name}}</span>
        <div @click="showUpload(item, 'img')" v-show="!item.value || item.value.length <= 8" v-if="item.permission == 1"
          style="position: relative;">
          <i class="iconfont icon-tupian" style="font-size: 22px;"></i>
          <div class="upload-box">
            <upload-box @uploadCallback="uploadCallback" type="image"></upload-box>
          </div>
        </div>
      </div>
      <div v-if="item.permission == 2">
        <div v-for="(file,index) in item.value" :key="index" class="img-show-wrap"
          @click="viewPhoto(`${baseUrl}${file}`)">
          <img v-lazy="imageFormat(file)" style="width: 100%;height: 100%;">
        </div>
      </div>
      <div v-else class="images-list">
        <div class="images-item" v-for="(path,i) in item.value" :key="i" v-if="item.value && item.value.length > 0">
          <img :src="`${baseUrl}${path}`" alt @click="viewPhoto(`${baseUrl}${file}`)" />
          <i class="iconfont icon-guanbi11 close-icon remove-img-icon" @click.stop="item.value.splice(i, 1);"></i>
        </div>
      </div>
    </div>

    <!-- 10、说明文字   && item.data.show（不在审批页显示） -->
    <div v-if="item.key ==='explain'">
      <a :href="item.value.link ? item.value.link: 'javascript:;'" v-if="!item.value.show">
        <p :style="{'white-space': 'pre-wrap', color: item.value.text_color ? item.value.text_color:'#969696'}"
          v-html="item.value.explain"></p>
      </a>
    </div>

    <!-- 11、金额输入框 -->
    <div v-if="item.key ==='money'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2">
        <p>{{item.value | formatNumber}}</p>
        <p v-if="item.data.strtoupper" style="font-size: 14px;">
          大写 <span style="color:#9c9a9a;margin-left: 10px;">{{ item.value | numberToString}}</span>
        </p>
      </div>
      <div v-else class="thin-line" style="padding-bottom: 5px;">
        <div class="selected-info">
          <input class="input-box number-input" type="number" :placeholder="item.data.tips" v-model="item.value" />
        </div>
        <div class="desc-box df-left" v-if="item.data.strtoupper">
          <div class="item-label">大写</div>
          <div class="txt">
            <!-- 根据数字转大写 -->
            <span v-if="item.value">{{ item.value | numberToString}}</span>
            <span v-else>壹万元整（示例）</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 12、附件 -->
    <div v-if="item.key ==='attachment'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2">
        <div v-for="(file,index) in item.value" :key="index" style="margin-bottom: 10px">
          <span>{{index+1}}. </span>
          <span style="text-decoration: underline;color: #409eff;"
            @click="previewFile(`${baseUrl}${file}`,`${file}`)">{{file.substring(file.lastIndexOf('/') + 1)}}</span>
          <span class="file-down" @click="downLoadFile(`${baseUrl}${file}`,`${file}`)">下载</span>
        </div>
      </div>
      <div v-else>
        <div class="component-view input-item-view">
          <div class="files-list">
            <div v-for="(path,i) in item.value" :key="i" v-if="item.value && item.value.length > 0"
              class="file-item df-left">
              <div class="upload-type__icon df-m">
                <i class="iconfont icon-tupian icon"
                  v-if="['jpg','JPG','jpeg','JPEG','png','PNG','gif','GIF','tif','TIF','bmp','BMP'].includes(path.substring(path.lastIndexOf('.') + 1))"></i>
                <i class="iconfont icon-wenjian1 icon" v-else></i>
              </div>
              <div class="file-info df-bt">
                <p class="file-name">{{path.substring(path.lastIndexOf('/') + 1)}}</p>
                <div class="file-remove">
                  <i class="iconfont icon-guanbi11 close-icon" @click.stop="item.value.splice(i, 1);"></i>
                </div>
              </div>
            </div>

            <!-- 最多上传9个附件 -->
            <div class="add-box" @click="showUpload(item, 'file')" v-show="!item.value || item.value.length <= 8">
              <i class="iconfont icon-jia1 add-icon"></i>
              <div class="upload-box">
                <upload-box @uploadCallback="uploadCallback" :modelId="detailInfo.id"></upload-box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 13、身份证 -->
    <div v-if="item.key ==='id_card'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2" v-html="item.value"></div>
      <div v-else>
        <div class="component-view input-item-view">
          <input class="input-box" type="text" :placeholder="item.data.tips" v-model="item.value" />
        </div>
      </div>
    </div>

    <!-- 14、电话 -->
    <div v-if="item.key ==='phone'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2" v-html="item.value"></div>
      <div v-else>
        <div class="component-view input-item-view">
          <input class="input-box" type="number" :placeholder="item.data.tips" v-model="item.value" />
        </div>
      </div>
    </div>

    <!-- 15、手写签名 -->
    <div v-if="item.key ==='sign'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label','df-bt']">
        <div>{{item.name}}</div>
        <div class="view-item-icon" @click="showSignPopup(item)" v-if="item.permission == 1">
          <i class="iconfont icon-qianming"></i>
        </div>
      </div>
      <div v-if="item.permission == 2">
        <img class="img-box" :src="`${item.value.includes('base64')?'':baseUrl}${item.value}`" alt="" @click="viewPhoto(`${item.value.includes('base64')?'':baseUrl}${item.value}`)"
          v-if="item.value">
      </div>
      <div v-else>
        <div class="component-view input-item-view">
          <div class="sign-view" @click="showSignPopup(item)" v-if="!item.value">
            <p>点击签名</p>
            <div class="sign-bg-watermark">
              <span v-for="(item, index) in 50" :key="index">手写签名</span>
            </div>
          </div>
          <div v-else class="canvas-img">
            <img :src="`${item.value.includes('base64')?'':baseUrl}${item.value}`" alt style="width: 100%;height: 180px;" />
            <i class="iconfont icon-guanbi11 remove-img-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 16、外部联系人 -->
    <div v-if="item.key ==='external_contact'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2">
        <span v-if="item.value">{{item.value.map(j => j.name).join('，')}}</span>
      </div>
      <div v-else class="edit-view" @click="selectOutContact(item)">
        <div v-if="!item.value" class="selected-info">
          <span class="item-view-tips">请选择</span>
          <i class="iconfont icon-arrow-left icon-arrow"></i>
        </div>
        <div v-else class="selected-info">
          <div>
            <p v-for="(item, index) in item.value" :key="index">{{item.name}}</p>
          </div>
          <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
        </div>
      </div>
    </div>
    <!-- 17、联系人 -->
    <div v-if="item.key ==='contact'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2">
        <span v-if="item.value">{{item.value.map(j => j.name).join('，')}}</span>
      </div>
      <div v-else class="edit-view" @click="selectContact(item)">
        <div v-if="!item.value" class="selected-info">
          <span class="item-view-tips">{{item.data.tips}}</span>
          <i class="iconfont icon-arrow-left icon-arrow"></i>
        </div>
        <div v-else class="selected-info">
          <div>
            <p v-for="(item, index) in item.value" :key="index">{{item.name}}</p>
          </div>
          <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
        </div>
      </div>
    </div>

    <!-- 18、部门  -->
    <div v-if="item.key ==='department'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2">
        <span v-if="item.value">{{item.value.map(j => j.name).join('，')}}</span>
      </div>
      <div v-else class="edit-view" @click="setCompany(item)">
        <div v-if="!item.value" class="selected-info">
          <span class="item-view-tips">请选择</span>
          <i class="iconfont icon-arrow-left icon-arrow"></i>
        </div>
        <div v-else class="selected-info">
          <div>
            <p v-for="(item, index) in item.value" :key="index">{{item.name}}</p>
          </div>
          <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
        </div>
      </div>
    </div>

    <!-- 19、地点 -->
    <div v-if="item.key ==='place'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label','df-bt']">
        <div>{{item.name}}</div>
        <div @click="getLocation(item)" style="flex-shrink: 0;" v-if="item.permission == 1">
          <span style="color: #409eff">{{item.value ? '刷新':'获取'}}</span>
        </div>
      </div>
      <div v-if="item.permission == 2">
        <span v-if="item.value">{{item.value}}</span>
      </div>
      <div v-else class="edit-view">
        <div style="text-align: left; flex: 1;padding: 0 5px">
          {{item.value}}
        </div>
      </div>
    </div>

    <!-- 20、 计算公式 -->
    <div v-if="item.key ==='formula'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2" v-html="item.value"></div>
      <div v-else class="thin-line" style="padding-bottom: 5px;">
        <div class="selected-info">
          <input class="input-box" type="number" :placeholder="item.data.tips" v-model="item.value" />
        </div>
        <div class="desc-box df-left" v-if="item.data.strtoupper">
          <div class="item-label">大写</div>
          <div class="txt">
            <!-- 根据数字转大写 -->
            <span v-if="item.value">{{ item.value | numberToString}}</span>
            <span v-else>壹万元整（示例）</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 21、电子发票 -->
    <div v-if="item.key ==='electronic_invoice'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label','df-bt']" style="padding: 5px 0;">
        <div>{{item.name}}</div>
        <div v-if="item.permission == 1">
          <i style="color: #409eff;font-size: 18px;" class="iconfont icon-jia1"></i>
        </div>
      </div>
      <div v-if="item.permission == 2">
        <span v-if="item.value">{{item.value.join('，')}}</span>
      </div>
      <div v-else class="edit-view"></div>
    </div>

    <!-- 22、关联审批单 -->
    <div v-if="item.key ==='relation_authorization'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div v-if="item.permission == 2">
        <div class="approval-list" v-if="item.value">
          <div class="approval-list__subitem df-bt" v-for="(row, index) in item.value" :key="index"
            @click="navigateTo(row)">
            <div>
              <i class="iconfont icon-guanlian icon" style="font-size: 16px;"></i>
              <span class="form-name">{{row.model_name}}</span>
            </div>
            <div>
              <span class="status pass-status" v-if="row.audit_status ===2">{{row.audit_status_msg}}</span>
              <span class="status refuse-status" v-else-if="row.audit_status ===3">{{row.audit_status_msg}}</span>
              <span class="status" v-else>{{row.audit_user_name}}处理中</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="edit-view">
        <div v-if="!item.value || item.value.length === 0" class="selected-info" @click="bindAuditForm(item)">
          <span class="item-view-tips">{{item.data.tips}}</span>
          <i class="iconfont icon-arrow-left icon-arrow"></i>
        </div>
        <div v-else class="approval-list">
          <div class="approval-list__subitem df-bt" v-for="(row, index) in item.value" :key="index"
            @click="navigateTo(row)">
            <div>
              <i class="iconfont icon-guanlian icon" style="font-size: 16px;"></i>
              <span class="form-name">{{row.model_name}}</span>
            </div>
            <div>
              <span class="status pass-status" v-if="row.audit_status ===2">{{row.audit_status_msg}}</span>
              <span class="status refuse-status" v-else-if="row.audit_status ===3">{{row.audit_status_msg}}</span>
              <span class="status" v-else>{{row.audit_user_name}}处理中</span>
              <i class="iconfont icon-guanbi1 icon" style="font-size: 12px;"
                @click.stop="item.value.splice(index, 1);"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 23、省市区 -->
    <div v-if="item.key ==='province'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label','df-bt']">
        <div>{{item.name}}</div>
        <div @click="showSelectCityPopup(item)" style="flex-shrink: 0;"
          v-if="(item.data.address_type == '1'||item.data.address_type == '3')  && item.permission == 1">
          <span style="color: #409eff">{{item.data.value ? '更改':'选择'}}</span>
        </div>
      </div>
      <div v-if="item.permission == 2">
        <span>{{item.value.area}}</span>
      </div>
      <div v-else>
        <div v-if="item.data.address_type == '1'||item.data.address_type == '3'">
          <div class="location-info">
            <span v-if="item.value && item.value.area">{{item.value.area}}</span>
          </div>
        </div>
        <div v-if="item.data.address_type == '2'">
          <div class="area-item df-bt">
            <div class="item-label">省市区</div>
            <div class="item-view__right" @click="showSelectCityPopup(item)">
              <span v-if="item.value && item.value.area">{{item.value.area}}</span>
              <span v-else class="item-view-tips">请选择</span>
              <i class="iconfont icon-arrow-left icon-arrow"></i>
            </div>
          </div>
          <!-- <div class="area-item df-bt">
            <div class="item-label">街道</div>
            <div class="item-view__right">
              <span class="item-view-tips">请选择</span>
              <i class="iconfont icon-arrow-left icon-arrow"></i>
            </div>
          </div> -->
          <div class="area-address">
            <input class="input-box" type="text" placeholder="详细地址" v-model="item['value']['address']" />
          </div>
        </div>
      </div>
    </div>

    <!-- 24、评分 -->
    <div v-if="item.key ==='score'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">
        <div class="item-label">
          {{item.name}}
          <span class="remove-score" @click="item.value = ''" v-if="item.value > 0 && item.permission == 1">
            <i class="iconfont icon-eraser-o"></i> 清除选择
          </span>
        </div>
      </div>
      <div v-if="item.permission == 2">
        <div class="df-left">
          <span class="icon-item" v-for="i in Number(item.value)" :key="i">
            <i class="iconfont icon-xingxing"></i>
          </span>
        </div>
      </div>
      <div v-else>
        <div class="component-view input-item-view">
          <div>
            <div class="star-icon-box">
              <span class="icon-item" :class="item.value >= i ? 'score-range':''"
                v-for="i in Number(`${item.data.score_type == '1' ? 5 : 10}`)" :key="i" @click="setScore(item, i)">
                <i class="iconfont icon-xingxing"></i>
              </span>
            </div>
            <div class="star-icon-box">
              <span class="icon-item" v-for="num in Number(`${item.data.score_type == '1' ? 5 : 10}`)" :key="num">{{ num
                }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 25、收款账户-->
    <div v-if="item.key ==='collection_account'">
      <span v-if="item.value">{{item.value.join('，')}}</span>
    </div>

    <!-- 27、城市 -->
    <div v-if="item.key ==='city'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2">
          <span v-if="item.value">{{item.value.join('，')}}</span>
        </div>
        <div v-else class="edit-view" @click="showSelectPopup(item,'city')">
          <div v-if="!item.value" class="selected-info">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <div>
              <p v-for="(item, index) in item.value" :key="index">{{item}}</p>
            </div>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 28、申请部门 -->
    <div v-if="item.key ==='department_id'">
      <div :class="[item.permission == 1 ? 'editable':'', 'tit-label']">{{item.name}}</div>
      <div>
        <div v-if="item.permission == 2">
          <span v-if="item.value">
            {{item.data.department.filter(j=>j.id === item.value).map(o=>o.label).join('，') }}
          </span>
        </div>
        <div v-else class="edit-view" @click="showSelectPopup(item,'department')">
          <div v-if="!item.value" class="selected-info">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <div>
              <!-- {{item.value}} -->
              {{item.data.department.filter(j=>j.id === item.value).map(o=>o.label).join('，') }}
            </div>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Indicator, Toast, Popup, Button, DatetimePicker } from "mint-ui";
  import * as dd from "dingtalk-jsapi";
  import UploadBox from "@/components/upload/index.vue";
  export default {
    components: {
      UploadBox,
    },
    data() {
      return {
        currentUploadType: '', //上传类型
        curSelectViewData: {},
        statisticsList: [], //打开当前表格的合计项数据
        baseUrl: JSON.parse(localStorage.getItem("ENV_HTTP")),
      }
    },
    props: ['item', 'applyAdjust','detailInfo'], //applyAdjust: 红充意见显示
    methods: {
      imgInfoCallback(width, height, url) {
        let that = this;
        //钉钉微应用预览api在安卓设备上，如果图片尺寸很大会出现第一次看不到图片，再次打开预览才能看到， 判断当图片尺寸超过3000，用后端接口处理。
        var useUrl = width > 3000 ? `${that.baseUrl}/api/get_image?url=${encodeURI(url)}&size=${width}` : encodeURI(url);
        dd.biz.util.previewImage({
          urls: [useUrl],//图片地址列表
          current: encodeURI(url),//当前显示的图片链接
          onSuccess: function (result) {
            /**/
          },
          onFail: function (err) {
          }
        })
      },
      // 图片预览
      viewPhoto(url) {
        let that = this;
        if (url.includes('.tif') || url.includes('.TIF')) {
          var useUrl = `${that.baseUrl}/api/get_image?url=${encodeURI(url)}`;
          dd.biz.util.previewImage({
            urls: [useUrl],//图片地址列表
            current: encodeURI(url),//当前显示的图片链接
            onSuccess: function (result) {
              /**/
            },
            onFail: function (err) {
            }
          })
        } else {
          var imgWidth = 0;
          var imgHeight = 0;
          var callback = null;
          var imgLoad = function (url, callback) {
            var img = new Image();
            img.src = encodeURI(url);
            if (img.complete) {
              callback(img.width, img.height, url);
            } else {
              img.onload = function () {
                callback(img.width, img.height, url);
                img.onload = null;
              };
            };
          };
          imgLoad(url, this.imgInfoCallback);
        }
      },

      // 关联审批单 
      bindAuditForm(item) {
        this.$emit('bindAuditForm', item)
      },
      // 移除关联审批单 
      removeAuditForm(item, index) {
        item.data.value.splice(index, 1);
        item.is_condition = true;
        this.storageValueChange(item)
      },
      showSignPopup(item) {
        this.$emit('showSignPopup', item)
      },
      showSelectCityPopup(item) {
        this.$emit('showSelectCityPopup', item)
      },

      /*
      * 显示选择窗口
      */
      showSelectPopup(item, key) {
        this.$emit('showSelectPopup', { item, key })
      },

      // 选择回调
      selectCallback(data) {
        this.$set(this.item, 'value', data);
        this.storageValueChange(this.item)
      },
      // 设置评分值
      setScore(item, index) {
        this.curSelectViewData = item;
        this.selectCallback(index)
      },

      /*
      * 显示日期选择
      */
      showDateSelect(item, type) {
        this.$emit('showDateSelect', { item, type })
      },
      // 移除日期值
      removeDateValue(item, type) {
        if (type === "start_value") {
          this.$set(item.data, "start_value", "");
        } else if (type === "end_value") {
          this.$set(item.data, "end_value", "");
        } else {
          this.$set(item.data, "value", "");
        }
      },

      // 上传回调
      uploadCallback(url) {
        this.$set(this.item, "value", this.item.value ? [...this.item.value, url] : [url]);
        this.storageValueChange(this.item)
      },

      showUpload(item, type) {
        console.log(item)
        this.currentUploadType = type;
      },
      // 移除 数组类型的值
      removeArrayValue(data, index) {
        this.item.value.splice(index, 1)
        this.storageValueChange(data)
      },
      /*
      * 移除值
      */
      removeValue(item) {
        this.$set(item, 'value', '');//基于表单里面选择多选项等处理
        this.storageValueChange(item)
      },
      storageValueChange(item) {
        this.$emit('valueChange', item)
      },
      /**
      * 图片格式化
     */
      imageFormat(path) {
        if (['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF', 'tif', 'TIF', 'bmp', 'BMP'].includes(path.substring(path.lastIndexOf('.') + 1))) {
          return `${this.baseUrl}/api/get_image?url=${this.baseUrl}${encodeURIComponent(path)}&size=300`
        } else {
          return ''
        }
      },
      previewFile(src, path) {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          console.log('手机端')
          //手机端
          const a = document.createElement('a'); // 创建a标签
          a.setAttribute('href', src);// href链接
          a.click();// 自执行点击事件
        } else {
          console.log('pc端')
          //pc端
          window.open(`${this.baseUrl}/api/preview_file?url=${this.baseUrl}/${encodeURIComponent(path)}`, '_blank')
        }
      },
      downLoadFile(src, path) {
        let _self = this;
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if (isiOS) {
          // this.showDownloadTips = true;
          this.$emit('handleDownloadTips', true)
          dd.biz.navigation.setRight({
            show: true,//控制按钮显示， true 显示， false 隐藏， 默认true
            control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '去下载',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
              // _self.showDownloadTips = false;
              _self.$emit('handleDownloadTips', false)
              window.open(src, '_self')
            },
            onFail: function (err) { }
          });
        } else if (isAndroid) {
          window.open(`${this.baseUrl}/api/download_file?url=${this.baseUrl}/${encodeURIComponent(path)}`, '_blank')
          // const a = document.createElement('a'); // 创建a标签
          // a.setAttribute('download', '');// download属性
          // a.setAttribute('href', src);// href链接
          // a.click();// 自执行点击事件
        } else {
          window.open(`${this.baseUrl}/api/download_file?url=${this.baseUrl}/${encodeURIComponent(path)}`, '_blank')
        }
      },
      // 选择外部联系人
      selectOutContact(item) {
        let self = this;
        this.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            dd.biz.contact.externalComplexPicker({
              title: "选择外部联系人",
              corpId: "ding55d1ed30f1647b6235c2f4657eb6378f",
              multiple: false, //默认只有单选
              limitTips: "超出了",
              maxUsers: 1000, //默认不限制
              pickedUsers: [], //已选，但可取消，只针对多选生效
              disabledUsers: [], //不可选，，只针对多选生效
              requiredUsers: [], //必选，只针对多选生效
              onSuccess: function (data) {
                if (data && data.length > 0) {
                  data.map(j => {
                    j.user_name = j.name;
                    return j;
                  })
                }
                self.selectCallback(data)
                /* data结构
                    [{
                          "emplId":"123",//选人的员工id
                          "name":"name",//员工姓名
                          "avatar":"avatarURL",//头像url
                          "orgName":"org"//公司名字
                      }]
                  */
              },
              onFail: function (err) {
                console.log(err);
              }
            });
          });
          dd.error(function (error) {
            console.log(error);
          });
        });
      },
      // 选择联系人
      selectContact(item) {
        /*
        * @option_type: 1只能选择一人   2可同时选择多人
        */
        let self = this;
        this.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            dd.biz.contact.complexPicker({
              title: "选择联系人", //标题
              corpId: "ding55d1ed30f1647b6235c2f4657eb6378f", //企业的corpId
              multiple: true, //是否多选
              limitTips: "设置了只能选择一个联系人", //超过限定人数返回提示
              maxUsers: item.data.option_type == '1' ? 1 : 1000, //最大可选人数
              pickedUsers: [], //已选用户
              pickedDepartments: [], //已选部门
              disabledUsers: [], //不可选用户
              disabledDepartments: [], //不可选部门
              requiredUsers: [], //必选用户（不可取消选中状态）
              requiredDepartments: [], //必选部门（不可取消选中状态）
              appId: 158, //微应用Id，企业内部应用查看AgentId
              permissionType: "xxx", //可添加权限校验，选人权限，目前只有GLOBAL这个参数
              responseUserOnly: true, //返回人，或者返回人和部门
              startWithDepartmentId: 0, //仅支持0和-1
              onSuccess: function (result) {
                if (result.users && result.users.length > 0) {
                  result.users.map(j => {
                    j.user_name = j.name;
                    return j;
                  })
                }
                self.selectCallback(result.users)
                /**{  selectedCount:1,  //选择人数
                      users:[{"name":"","avatar":"","userid":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），emplId（用户工号）三个字段
                      departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
                  } */
              },
              onFail: function (err) {
                console.log(err);
              }
            });
          });
        });
      },
      // 选择部门
      setCompany(item) {
        /*
        * @option_type: 1只能选择一人   2可同时选择多人
        */
        let self = this;
        this.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          if (res.status === "ok") {
            dd.config(res.data);
            dd.ready(function () {
              dd.biz.contact.departmentsPicker({
                title: "选择部门", //标题
                corpId: "ding55d1ed30f1647b6235c2f4657eb6378f", //企业的corpId
                multiple: true, //是否多选
                limitTips: "设置了只能选择一个部门", //超过限定人数返回提示
                maxDepartments: item.data.option_type == '1' ? 1 : 1000, //最大选择部门数量
                pickedDepartments: [], //已选部门
                disabledDepartments: [], //不可选部门
                requiredDepartments: [], //必选部门（不可取消选中状态）
                appId: 158, //微应用的Id
                permissionType: "xxx", //选人权限，目前只有GLOBAL这个参数
                onSuccess: function (result) {
                  self.selectCallback(result.departments)
                  /**{
                        userCount:1,                              //选择人数
                        departmentsCount:1，//选择的部门数量
                        departments:[{"id":,"name":"","number":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
                    }*/
                },
                onFail: function (err) {
                  console.log(err);
                }
              });
            });
          }
        });
      },
      //获取当前位置
      getLocation(item) {
        Indicator.open('正在获取位置信息');
        let self = this;
        self.curSelectViewData = item;
        this.$http.dd_config().then(res => {
          dd.config(res.data);
          dd.ready(function () {
            dd.device.geolocation.get({
              targetAccuracy: Number,
              coordinate: Number,
              withReGeocode: Boolean,
              useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
              onSuccess: function (result) {
                Indicator.close();
                if (result.errorCode === 4) {
                  Toast(`获取位置失败，请打开手机定位服务`);
                }
                self.selectCallback(result.address)
              },
              onFail: function (err) {
                console.log(err);
              }
            });
          })

        });
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../styles/module-unit.scss";
</style>