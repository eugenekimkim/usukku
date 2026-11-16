import Foundation
import UIKit
import HealthKit
import Capacitor

/// 우수꾸 전용 작은 HealthKit 플러그인.
///
/// 운동 목록 · 거리 · ID는 @capgo/capacitor-health가 읽어요. 그 플러그인에 없는 두 가지만 여기서 해요.
/// 1. 수영 거리(HKQuantityTypeIdentifier.distanceSwimming) 읽기 권한을 운동 권한과 한 번에 요청
///    (capgo의 'distance'는 걷기 · 달리기 거리만 가리켜요)
/// 2. 운동에 거리가 없을 때, 그 시간대의 수영 거리 합계를 따로 읽기
/// 그리고 권한을 다시 켜도록 설정 앱을 여는 기능도 넣었어요.
@objc(UsukkuHealthPlugin)
public class UsukkuHealthPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "UsukkuHealthPlugin"
    public let jsName = "UsukkuHealth"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestSwimAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sumSwimDistance", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openSettings", returnType: CAPPluginReturnPromise)
    ]

    private let store = HKHealthStore()
    private let iso: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    private let isoPlain = ISO8601DateFormatter()

    private func parseDate(_ s: String?) -> Date? {
        guard let s = s else { return nil }
        return iso.date(from: s) ?? isoPlain.date(from: s)
    }

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }

    /// 운동 + 수영 거리 읽기 권한을 시트 한 번으로 요청해요.
    /// HealthKit은 읽기 권한을 거절했는지 알려주지 않아서, 결과는 "물어봤는지(asked)"만 돌려줘요.
    @objc func requestSwimAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable(),
              let swimDistance = HKObjectType.quantityType(forIdentifier: .distanceSwimming) else {
            call.reject("HealthKit을 쓸 수 없는 기기예요", "unavailable")
            return
        }
        let read: Set<HKObjectType> = [HKObjectType.workoutType(), swimDistance]
        store.requestAuthorization(toShare: nil, read: read) { success, error in
            if let error = error {
                call.reject(error.localizedDescription, "request-failed", error)
                return
            }
            call.resolve(["asked": success])
        }
    }

    /// [startDate, endDate) 시간대의 수영 거리 합계(m). 겹치는 샘플을 HealthKit 통계로 더해요.
    @objc func sumSwimDistance(_ call: CAPPluginCall) {
        guard let type = HKObjectType.quantityType(forIdentifier: .distanceSwimming) else {
            call.reject("수영 거리 타입을 찾을 수 없어요", "unavailable")
            return
        }
        guard let start = parseDate(call.getString("startDate")),
              let end = parseDate(call.getString("endDate")), end > start else {
            call.reject("startDate · endDate가 필요해요", "bad-range")
            return
        }
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: [])
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, stats, error in
            if let error = error as? HKError, error.code == .errorNoData {
                call.resolve(["meters": 0])
                return
            }
            if let error = error {
                call.reject(error.localizedDescription, "query-failed", error)
                return
            }
            let meters = stats?.sumQuantity()?.doubleValue(for: .meter()) ?? 0
            call.resolve(["meters": meters])
        }
        store.execute(query)
    }

    /// 설정 앱의 우수꾸 화면을 열어요. 건강 권한은 설정 > 개인정보 보호 및 보안 > 건강 > 우수꾸에서 바꿔요.
    @objc func openSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let url = URL(string: UIApplication.openSettingsURLString) else {
                call.reject("설정을 열 수 없어요")
                return
            }
            UIApplication.shared.open(url, options: [:]) { ok in
                ok ? call.resolve() : call.reject("설정을 열 수 없어요")
            }
        }
    }
}
