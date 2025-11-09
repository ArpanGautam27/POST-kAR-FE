# 🚀 Deployment Checklist - Lazy Loading + R2 Migration

## ⚠️ IMPORTANT: Before Deploying

### **1. Update R2 URL in Multiple Files**

Replace `https://pub-xxxxxxxxxxxxx.r2.dev` with your actual R2 bucket URL in:

- [ ] `src/config/r2-media.ts` (line 6)
- [ ] `.env.production` (`VITE_R2_BASE_URL`)
- [ ] `.env.development` (`VITE_R2_BASE_URL`)
- [ ] `index.html` (lines 49-50)

### **2. Verify R2 Files Are Uploaded**

Check your R2 bucket has:
- [ ] `/videos/customer_feedback_1.mp4` through `customer_feedback_11.mp4`
- [ ] `/videos/hero_section_header.mp4`
- [ ] `/videos/IgasVideo.mp4`
- [ ] `/images/products/` (all 17 product images)

### **3. Test Locally**

```bash
npm run dev
```

Check:
- [ ] Hero video loads immediately
- [ ] First 3 community videos load
- [ ] Other videos load when scrolling
- [ ] Product images display correctly
- [ ] Scanner page works

### **4. Build for Production**

```bash
npm run build
```

Check build output:
- [ ] No TypeScript errors
- [ ] Bundle size < 10MB (down from 180MB!)
- [ ] All chunks created successfully

### **5. Deploy to Netlify**

```bash
npm run deploy:netlify
```

Or push to Git (auto-deploy):
```bash
git add .
git commit -m "feat: implement lazy loading and R2 migration"
git push origin main
```

### **6. Post-Deployment Verification**

Visit: `https://postkar-fe.netlify.app`

**Network Tab Test:**
1. Open DevTools → Network → Filter "Media"
2. Reload page
3. **Expected**: Only hero video + 3 videos load initially (~20-30MB)
4. Scroll down
5. **Expected**: More videos load progressively

**Performance Test:**
1. Open DevTools → Lighthouse
2. Run Performance Audit
3. **Target Scores**:
   - Performance: > 80
   - LCP: < 2.5s
   - FID: < 100ms

---

## 📊 Expected Results

### **Before Optimization**
- Bundle size: ~180MB
- Initial load: 15-30 seconds
- All 11 videos load simultaneously
- Poor mobile experience

### **After Optimization**
- Bundle size: ~5-10MB
- Initial load: 2-5 seconds
- Progressive video loading
- Smooth mobile experience

**Improvement: 85-90% faster!**

---

## 🐛 Common Issues & Fixes

### **Issue: Hero video not loading**
**Fix**: 
1. Check R2 URL in `.env.production`
2. Verify video exists in R2 bucket
3. Check CORS settings on R2 bucket

### **Issue: Videos load all at once**
**Fix**:
1. Verify `LazyVideo` component is imported
2. Check `priority` prop is set correctly
3. Clear browser cache and test

### **Issue: 404 errors for images**
**Fix**:
1. Verify product images uploaded to R2
2. Check filenames match exactly (case-sensitive)
3. Update `src/data/products.ts` with correct names

### **Issue: Scanner not working**
**Fix**:
1. Update `public/scanner/scan_mind.html` line 35
2. Use full R2 URL (not relative path)
3. Test on HTTPS (camera requires secure context)

---

## 🔄 Rollback Plan

If issues occur after deployment:

### **Quick Rollback (Netlify)**
1. Go to Netlify Dashboard
2. Click "Deploys"
3. Find previous working deployment
4. Click "Publish deploy"

### **Code Rollback**
```bash
git revert HEAD
git push origin main
```

---

## 📈 Monitoring

### **First 24 Hours**
- [ ] Monitor Netlify Analytics for errors
- [ ] Check browser console for JS errors
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Verify video playback on iOS Safari

### **First Week**
- [ ] Monitor Core Web Vitals in Google Search Console
- [ ] Check page load times in Netlify Analytics
- [ ] Gather user feedback on performance
- [ ] Monitor R2 bandwidth usage

---

## ✅ Success Criteria

- [ ] Hero video loads in < 2 seconds
- [ ] Initial page load < 5 seconds
- [ ] Lighthouse Performance score > 80
- [ ] No console errors
- [ ] All videos play correctly
- [ ] Scanner functionality works
- [ ] Mobile experience is smooth

---

## 📞 Support

If you encounter issues:
1. Check `LAZY_LOADING_GUIDE.md` for detailed documentation
2. Review browser console for errors
3. Test with DevTools Network tab
4. Verify R2 bucket permissions and CORS

---

**Last Updated**: 2025-11-09  
**Version**: 1.0.0  
**Status**: Ready for Production ✅
