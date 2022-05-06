<template>
  <div>
    <div class="container">
      <!-- 1、单行输入框 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='single_input'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          <div>{{item.data.title}}</div>
        </div>
        <div class="item-input">
          <input class="input-box" type="text" :placeholder="item.data.tips" v-model="item.data.value"
            @blur="storageValueChange(item)" />
        </div>
      </div>

      <!-- 2、多行输入框 -->
      <div class="component-view input-item-view" v-if="item.key ==='multiple_input'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-input-many">
          <textarea class="input-textarea-box" rows="4" :placeholder="item.data.tips" v-model="item.data.value"
            @blur="storageValueChange(item)"></textarea>
        </div>
      </div>

      <!-- 3、数字输入框 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='number_input'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}} {{item.data.unit ? `(${ item.data.unit})` :''}}
        </div>
        <div class="item-input">
          <input class="input-box number-input" type="number" :placeholder="item.data.tips" v-model="item.data.value"
            @change="storageValueChange(item)" />
        </div>
      </div>

      <!-- 4、单选框 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='radio_choice'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-view__right" @click="showSelectPopup(item,'radio')">
          <div v-if="!item.data.value">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.data.value}}</span>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>

      <!-- 5、多选框 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='multiple_choice'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-view__right" @click="showSelectPopup(item,'check')">
          <div v-if="!item.data.value || item.data.value.length === 0">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.data.value.join(',')}}</span>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>

      <!-- 6、日期 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='date'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-view__right" @click="showDateSelect(item)">
          <div v-if="!item.data.value">
            <span class="item-view-tips">请选择</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.data.value}}</span>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>

      <!-- 7、日期区间 -->
      <div class="component-view" v-if="item.key ==='date_rang'">
        <div class="input-item-view df-bt">
          <div>
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.start_date_title}}
          </div>
          <div class="item-view__right" @click="showDateSelect(item, 'start_value')">
            <div v-if="!item.data.start_value">
              <span class="item-view-tips">{{item.data.tips}}</span>
              <i class="iconfont icon-arrow-left icon-arrow"></i>
            </div>
            <div v-else class="selected-info">
              <span>{{item.data.start_value}}</span>
              <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeDateValue(item, 'start_value')"></i>
            </div>
          </div>
        </div>

        <div class="input-item-view df-bt" style="border-top: 1px solid #f5f5f5;position: relative;">
          <div>
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.end_date_title}}
          </div>
          <div class="item-view__right" @click="showDateSelect(item, 'end_value')">
            <div v-if="!item.data.end_value">
              <span class="item-view-tips">{{item.data.tips}}</span>
              <i class="iconfont icon-arrow-left icon-arrow"></i>
            </div>
            <div v-else class="selected-info">
              <span>{{item.data.end_value}}</span>
              <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeDateValue(item, 'end_value')"></i>
            </div>
          </div>
        </div>
        <div v-if="item.data.auto_calculation">
          <!-- 自动计算时长 -->
        </div>
      </div>

      <!-- 8、图片 -->
      <div class="component-view input-item-view" v-if="item.key ==='picture'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="images-list">
          <div class="images-item" v-for="(path,i) in item.data.value" :key="i"
            v-if="item.data.value && item.data.value.length > 0">
            <img :src="imageFormat(path)" @click="viewPhoto(`${baseUrl}${path}`)" alt />
            <i class="iconfont icon-guanbi11 close-icon remove-img-icon" @click.stop="removeArrayValue(item, i)"></i>
          </div>
          <!-- 最多上传9张图片 -->
          <div class="add-box" @click="showUpload(item, 'img')"
            v-show="!item.data.value || item.data.value.length <= 8">
            <i class="iconfont icon-jia1 add-icon"></i>
            <div class="upload-box">
              <upload-box @uploadCallback="uploadCallback" type="image"></upload-box>
            </div>
          </div>
        </div>
      </div>

      <!-- 10、说明文字   && item.data.show（不在审批页显示） -->
      <div class="component-view table-view" v-if="item.key ==='explain'">
        <div class="table-tit" style="padding-left: 20px">
          <a :href="item.data.link ? item.data.link: 'javascript:;'">
            <p :style="{'white-space': 'pre-wrap', color: item.data.text_color ? item.data.text_color:''}"
              v-html="item.data.explain"></p>
          </a>
        </div>
      </div>

      <!-- 11、金额输入框 -->
      <div class="component-view input-item-view" v-if="item.key ==='money'">
        <div class="df-bt">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div class="item-input">
            <input class="input-box number-input" type="number" :placeholder="item.data.tips" v-model="item.data.value"
              @change="storageValueChange(item)" />
          </div>
        </div>
        <div class="desc-box df-bt" v-if="item.data.strtoupper">
          <div class="item-label">大写</div>
          <div class="txt">
            <!-- 根据数字转大写 -->
            <p v-if="item.data.value">
              <span>{{ item.data.value | numberToString}}</span>
              <span v-if="item.data.thousands"> ({{ item.data.value | formatNumber}})</span>
            </p>
            <p v-else>壹万元整（示例）</p>
          </div>
        </div>
        <div class="df-right" v-if="item.data.thousands && !item.data.strtoupper">
          <div style="color: #999;font-size: 12px;" v-if="item.data.value">({{item.data.value | formatNumber}})</div>
        </div>
      </div>

      <!-- 12、附件 -->
      <div class="component-view input-item-view" v-if="item.key ==='attachment'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="files-list">
          <div v-for="(path,i) in item.data.value" :key="i" v-if="item.data.value && item.data.value.length > 0"
            class="file-item df-left" @click="previewFile(`${baseUrl}${path}`,`${path}`)">
            <div class="upload-type__icon df-m">
              <i class="iconfont icon-tupian icon"
                v-if="['jpg','JPG','jpeg','JPEG','png','PNG','gif','GIF','tif','TIF','bmp','BMP'].includes(path.substring(path.lastIndexOf('.') + 1))"></i>
              <i class="iconfont icon-wenjian1 icon" v-else></i>
            </div>
            <div class="file-info">
              <p class="file-name">{{path.substring(path.lastIndexOf('/') + 1)}}</p>
              <div class="file-remove">
                <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeArrayValue(item, i)"></i>
              </div>
            </div>
          </div>

          <!-- 最多上传9个附件 -->
          <div class="add-box" @click="showUpload(item, 'file')"
            v-show="!item.data.value || item.data.value.length <= 8">
            <i class="iconfont icon-jia1 add-icon"></i>
            <div class="upload-box">
              <upload-box @uploadCallback="uploadCallback" :modelId="modelId"></upload-box>
            </div>
          </div>
        </div>
      </div>

      <!-- 13、身份证 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='id_card'">
        <div>
          <div>
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div>
            <input class="input-box" type="text" :placeholder="item.data.tips" v-model="item.data.value"
              @blur="storageValueChange(item)" />
          </div>
        </div>
      </div>

      <!-- 14、电话 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='phone'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-input">
          <input class="input-box" type="number" :placeholder="item.data.tips" v-model="item.data.value"
            @blur="storageValueChange(item)" />
        </div>
      </div>

      <!-- 15、手写签名 -->
      <div class="component-view input-item-view" v-if="item.key ==='sign'">
        <div class="df-bt">
          <div>
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div class="view-item-icon" @click="showSignPopup(item)">
            <i class="iconfont icon-qianming"></i>
          </div>
        </div>
        <div class="sign-view" @click="showSignPopup(item)" v-if="!item.data.value">
          <p>点击签名</p>
          <div class="sign-bg-watermark">
            <span v-for="(item, index) in 50" :key="index">手写签名</span>
          </div>
        </div>
        <div v-else class="canvas-img">
          <img :src="`${item.data.value.includes('base64')?'':baseUrl}${item.data.value}`" alt
            style="width: 100%;height: 180px;" />
          <i class="iconfont icon-guanbi11 remove-img-icon" @click.stop="removeValue(item)"></i>
        </div>
      </div>

      <!-- 16、外部联系人 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='external_contact'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-view__right" @click="selectOutContact(item)">
          <span v-if="item.data.value && item.data.value.length > 0">{{item.data.value.map(j =>
            j.name).join(',')}}</span>
          <span v-else class="item-view-tips">请选择</span>
          <i class="iconfont icon-arrow-left icon-arrow" v-if="!item.data.value"></i>
          <i class="iconfont icon-guanbi11 close-icon ml-10" v-else @click.stop="removeValue(item)"></i>
        </div>
      </div>

      <!-- 17、联系人 -->
      <div class="component-view input-item-view" v-if="item.key ==='contact'">
        <div class="df-bt" style="margin-bottom: 5px;">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div @click="selectContact(item)">
            <span style="color: #409eff">{{item.data.value && item.data.value.length > 0 ? '修改':'添加'}}</span>
          </div>
        </div>
        <div class="contact-list df-bt" v-for="(val,index) in item.data.value" :key="index"
          v-if="item.data.value && item.data.value.length > 0">
          <span class="name">{{val.name}}</span>
          <i class="iconfont icon-guanbi1 close-icon" @click.stop="item.data.value.splice(index, 1);"></i>
        </div>
      </div>

      <!-- 18、部门  -->
      <div class="component-view input-item-view" v-if="item.key ==='department'">
        <div class="df-bt" style="margin-bottom: 5px;">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div @click="setCompany(item)">
            <span style="color: #409eff">{{item.data.value && item.data.value.length > 0 ? '修改':'添加'}}</span>
          </div>
        </div>

        <div class="contact-list df-bt" v-for="(val,index) in item.data.value" :key="index"
          v-if="item.data.value && item.data.value.length > 0">
          <span class="name">{{val.name}}</span>
          <i class="iconfont icon-guanbi1 close-icon" @click="item.data.value.splice(index, 1);"></i>
        </div>
      </div>

      <!-- 19、地点 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='place'">
        <div class="df-bt">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            当前地点
          </div>
          <div style="text-align: right; flex: 1;padding: 0 15px">
            {{item.data.value}}
          </div>
        </div>
        <div @click="getLocation(item)" style="flex-shrink: 0;">
          <span style="color: #409eff">{{item.data.value ? '刷新':'获取'}}</span>
        </div>
      </div>

      <!-- 20、 计算公式 -->
      <div class="component-view input-item-view" v-if="item.key ==='formula'">
        <div class="df-bt">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div class="item-input">
            <input class="input-box" type="number" :placeholder="item.data.tips" v-model="item.data.value"
              @blur="storageValueChange(item)" />
          </div>
        </div>
        <div class="desc-box df-bt" v-if="item.data.strtoupper">
          <div class="item-label">大写</div>
          <div class="txt">
            <!-- 根据数字转大写 -->
            <span v-if="item.data.value">{{ item.data.value | numberToString}}</span>
            <span v-else>壹万元整（示例）</span>
          </div>
        </div>
      </div>

      <!-- 21、电子发票 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='electronic_invoice'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div>
          <i style="color: #409eff;font-size: 16px;" class="iconfont icon-jia1"></i>
        </div>
      </div>

      <!-- 22、关联审批单 -->
      <div class="component-view input-item-view" v-if="item.key ==='relation_authorization'">
        <div class="df-bt">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div class="item-view__right" @click="bindAuditForm(item)">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
        </div>
        <div class="approval-list" v-if="item.data.value && item.data.value.length > 0">
          <div class="approval-list__subitem df-bt" v-for="(row, index) in item.data.value" :key="index"
            @click="navigateTo(row)">
            <div class="df-left">
              <div><i class="iconfont icon-guanlian badge-icon"></i></div>
              <div>
                <span class="form-name">{{row.model_name}}</span>
              </div>
            </div>
            <div class="subitem-right">
              <span class="status pass-status" v-if="row.audit_status ===2">{{row.audit_status_msg}}</span>
              <span class="status refuse-status" v-else-if="row.audit_status ===3">{{row.audit_status_msg}}</span>
              <span class="status" v-else>{{row.audit_user_name}}处理中</span>
              <i class="iconfont icon-guanbi1 icon" @click.stop="removeAuditForm(item, index)"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 23、省市区 -->
      <div class="component-view input-item-view" v-if="item.key ==='province'">
        <div v-if="item.data.address_type == '1'||item.data.address_type == '3'">
          <div class="df-bt">
            <div class="item-label">
              <span class="required-icon" v-if="item.data.required">*</span>
              {{item.data.title}}
            </div>
            <div @click="showSelectCityPopup(item)">
              <span style="color: #409eff">选择</span>
            </div>
          </div>
          <div class="location-info">
            <span v-if="item.data.value && item.data.value.area">{{item.data.value.area}}</span>
          </div>
        </div>
        <div v-if="item.data.address_type == '2'">
          <div class="item-label">
            <span class="required-icon" v-if="item.data.required">*</span>
            {{item.data.title}}
          </div>
          <div class="area-item df-bt">
            <div class="item-label">省市区</div>
            <div class="item-view__right" @click="showSelectCityPopup(item)">
              <span v-if="item.data.value && item.data.value.area">{{item.data.value.area}}</span>
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
            <input class="input-box" type="text" placeholder="详细地址" v-model="item.data['value']['address']" />
          </div>
        </div>
      </div>

      <!-- 24、评分 -->
      <div class="component-view input-item-view" v-if="item.key ==='score'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
          <span class="remove-score" @click.stop="removeValue(item)" v-if="item.data.value > 0">
            <i class="iconfont icon-eraser-o"></i> 清除选择
          </span>
        </div>
        <div>
          <div class="star-icon-box">
            <span class="icon-item" :class="item.data.value >= i ? 'score-range':''"
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

      <!--25、收款账户 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='collection_account'">
        <div>
          <div>
            <span class="required-icon">*</span>
            {{item.data.title}}
          </div>
          <div class="required-tips">{{item.data.tips}}</div>
        </div>
        <div></div>
      </div>

      <!-- 27、城市 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='city'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-view__right" @click="showSelectPopup(item,'city')">
          <div v-if="!item.data.value || item.data.value.length === 0">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.data.value.join(',')}}</span>
            <i class="iconfont icon-guanbi11 close-icon" @click.stop="removeValue(item)"></i>
          </div>
        </div>
      </div>

      <!-- 28、申请部门 -->
      <div class="component-view input-item-view df-bt" v-if="item.key ==='department_id'">
        <div class="item-label">
          <span class="required-icon" v-if="item.data.required">*</span>
          {{item.data.title}}
        </div>
        <div class="item-view__right" @click="showSelectPopup(item,'department')">
          <div v-if="!item.data.value">
            <span class="item-view-tips">{{item.data.tips}}</span>
            <i class="iconfont icon-arrow-left icon-arrow"></i>
          </div>
          <div v-else class="selected-info">
            <span>{{item.data.department.filter(j=>j.id === item.data.value).map(o=>o.label).join('，') }}</span>
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
    props: ['item', 'modelId'],
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
      //附件预览
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
        this.$set(this.item.data, 'value', data);
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
        this.$set(this.item.data, "value", this.item.data.value ? [...this.item.data.value, url] : [url]);
        this.storageValueChange(this.item)
      },

      showUpload(item, type) {
        this.currentUploadType = type;
      },
      // 移除 数组类型的值
      removeArrayValue(data, index) {
        this.item.data.value.splice(index, 1)
        this.storageValueChange(data)
      },
      /*
      * 移除值
      */
      removeValue(item) {
        this.$set(item.data, 'value', '');//基于表单里面选择多选项等处理
        this.storageValueChange(item)
      },
      storageValueChange(item) {
        this.$emit('valueChange', item)
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