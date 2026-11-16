import UIKit
import Capacitor

/// 앱 안에 둔 플러그인(UsukkuHealthPlugin)을 Capacitor에 등록해요.
/// Main.storyboard의 첫 화면이 이 클래스를 써요.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(UsukkuHealthPlugin())
    }
}
